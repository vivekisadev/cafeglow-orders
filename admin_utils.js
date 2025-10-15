const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const adminModel = require('./models/admin.model.js');

async function connectDB() {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cafeflow');
}

async function disconnectDB() {
    await mongoose.disconnect();
}

async function listAdmins() {
    await connectDB();
    const admins = await adminModel.find({});
    
    console.log('Current Admin Accounts:');
    console.log('======================');
    admins.forEach((admin, index) => {
        console.log(`${index + 1}. ID: ${admin._id}`);
        console.log(`   Name: ${admin.name}`);
        console.log(`   Email: ${admin.email}`);
        console.log(`   Phone: ${admin.phone || 'Not set'}`);
        console.log('---');
    });
    
    await disconnectDB();
}

async function createAdmin(name, email, password) {
    await connectDB();
    
    // Check if email already exists
    const existingAdmin = await adminModel.findOne({ email });
    if (existingAdmin) {
        console.log(`Admin with email ${email} already exists!`);
        await disconnectDB();
        return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
        name,
        email,
        password: hashedPassword
    });
    
    await newAdmin.save();
    console.log(`Admin account created successfully!`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    await disconnectDB();
}

async function resetAllAdmins(name, email, password) {
    await connectDB();
    
    console.log('Removing all existing admin accounts...');
    const deleteResult = await adminModel.deleteMany({});
    console.log(`Removed ${deleteResult.deletedCount} admin accounts`);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new adminModel({
        name,
        email,
        password: hashedPassword
    });
    
    await newAdmin.save();
    console.log('New admin account created successfully!');
    console.log(`Name: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    
    await disconnectDB();
}

async function deleteAdmin(email) {
    await connectDB();
    
    const result = await adminModel.deleteOne({ email });
    if (result.deletedCount > 0) {
        console.log(`Admin with email ${email} deleted successfully!`);
    } else {
        console.log(`No admin found with email ${email}`);
    }
    
    await disconnectDB();
}

// Command line interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
    case 'list':
        listAdmins();
        break;
    case 'create':
        if (args.length !== 3) {
            console.log('Usage: node admin_utils.js create <name> <email> <password>');
        } else {
            createAdmin(args[0], args[1], args[2]);
        }
        break;
    case 'reset':
        if (args.length !== 3) {
            console.log('Usage: node admin_utils.js reset <name> <email> <password>');
        } else {
            resetAllAdmins(args[0], args[1], args[2]);
        }
        break;
    case 'delete':
        if (args.length !== 1) {
            console.log('Usage: node admin_utils.js delete <email>');
        } else {
            deleteAdmin(args[0]);
        }
        break;
    default:
        console.log('Admin Management Utility');
        console.log('=========================');
        console.log('Commands:');
        console.log('  list                    - List all admin accounts');
        console.log('  create <name> <email> <password>  - Create new admin');
        console.log('  reset <name> <email> <password>     - Reset all admins and create one');
        console.log('  delete <email>         - Delete admin by email');
        console.log('');
        console.log('Examples:');
        console.log('  node admin_utils.js list');
        console.log('  node admin_utils.js create "Admin User" admin@example.com mypassword');
        console.log('  node admin_utils.js reset "vivekverma" iamvivek@gmail.com vivek@admin');
        console.log('  node admin_utils.js delete admin@example.com');
}

module.exports = { listAdmins, createAdmin, resetAllAdmins, deleteAdmin };