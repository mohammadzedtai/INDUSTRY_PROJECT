import { Category } from "../model/categoryModel.js";
import uploadImageToCloudinary from "../utils/uploadImageToCloudinary.js";

// CREATE CATEGORY
export const createCategory = async (req, res) => {
    try {
        const { name, parentCategory } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                status: false,
                message: "Category name is required",
            });
        }

        // Uploaded file Multer se milegi
        if (!req.file) {
            return res.status(400).json({
                status: false,
                message: "Category image is required",
            });
        }

        const imageUrl = await uploadImageToCloudinary(req.file.buffer);



        const slug = name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");

        const existcategory = await Category.findOne({ name });

        if (existcategory) {
            return res.status(400).json({
                status: false,
                message: "Category Already set"
            })
        }

        const category = await Category.create({
            name,
            slug,
            image: imageUrl,
            parentCategory: parentCategory || null
        });

        return res.status(201).json({
            status: true,
            message: "Category created successfully",
            data: category
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET ALL CATEGORIES — Parent + Child
export const getCategory = async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

// GET ONLY PARENT CATEGORIES
export const GetParentCategories = async (req, res) => {
    try {
        const categories = await Category.find({
            $or: [
                { parentCategory: null },
                { parentCategory: { $exists: false } }
            ]
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            status: true,
            data: categories
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const existcategory = await Category.findByIdAndDelete(id);

        if (!existcategory) {
            return res.status(404).json({
                status: false,
                message: "category not found"
            })
        }

        return res.status(200).json({
            status: true,
            message: "Category Delete Succesfully!",
            data: existcategory
        })
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: `Delete Category Error :  ${error}`
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        const existcategory = await Category.findById(id);

        if (!existcategory) {
            return res.status(404).json({
                status: false,
                message: "Category not found"
            });
        }

        // Name update
        if (name) {
            existcategory.name = name;

            existcategory.slug = name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }

        // New image select ki hai to upload karo
        if (req.file) {
            const imageUrl = await uploadImageToCloudinary(
                req.file.buffer
            );

            existcategory.image = imageUrl;
        }

        await existcategory.save();

        return res.status(200).json({
            status: true,
            message: "Category updated successfully",
            data: existcategory
        });

    } catch (error) {
        return res.status(500).json({
            status: false,
            message: "Error updating category",
            error: error.message
        });
    }
};




export const bulkCreateCategories = async (req, res) => {
    try {
        const categories = req.body;

        if (!Array.isArray(categories) || categories.length === 0) {
            return res.status(400).json({
                status: false,
                message: "Data must be a non-empty array"
            });
        }

        const result = [];

        for (const item of categories) {
            if (!item.name || !item.name.trim()) {
                return res.status(400).json({
                    status: false,
                    message: "Category name is required"
                });
            }

            const name = item.name.trim();

            const slug = item.slug?.trim().toLowerCase() ||
                name.toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

            let parentId = null;

            // Parent category ka naam ya MongoDB ID accept karo
            if (item.parentCategory) {
                const parentValue = item.parentCategory.trim();

                let parent;

                if (/^[0-9a-fA-F]{24}$/.test(parentValue)) {
                    parent = await Category.findById(parentValue);
                } else {
                    const parentSlug = parentValue
                        .toLowerCase()
                        .replace(/[^a-z0-9]+/g, "-")
                        .replace(/^-|-$/g, "");

                    parent = await Category.findOne({
                        slug: parentSlug,
                        parentCategory: null
                    });
                }

                if (!parent) {
                    return res.status(400).json({
                        status: false,
                        message: `Parent category '${parentValue}' not found`,
                        category: name
                    });
                }

                parentId = parent._id;
            }

            // Existing slug ho to duplicate create mat karo
            let category = await Category.findOne({ slug });

            if (category) {
                category.name = name;
                category.parentCategory = parentId;
                
                // Existing image ko blank se overwrite nahi karna
                if (item.image !== undefined && item.image !== "") {
                    category.image = item.image;
                }

                await category.save();
            } else {
                category = await Category.create({
                    name,
                    slug,
                    image: item.image || "",
                    parentCategory: parentId
                });
            }

            result.push(category);
        }

        return res.status(200).json({
            status: true,
            message: "Categories created/updated successfully",
            total: result.length,
            data: result
        });

    } catch (error) {
        console.error("Bulk category error:", error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
