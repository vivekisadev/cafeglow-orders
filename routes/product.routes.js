 // Update product (admin only)
router.put('/products/:id', isLoggedIn, async (req, res) => {
    try {
        // Allow partial updates and include availability + ingredients
        const allowedFields = ['name', 'price', 'description', 'image', 'category', 'availability', 'ingredients'];
        const updateData = {};
        for (const key of allowedFields) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updateData[key] = req.body[key];
            }
        }

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ success: false, message: 'No valid fields provided for update' });
        }

        const updatedProduct = await productModel.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.json({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        console.error('Update product error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});