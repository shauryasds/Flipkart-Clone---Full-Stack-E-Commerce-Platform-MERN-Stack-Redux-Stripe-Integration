const { catchAsyncErrors } = require("../middleware/catchAsyncErrors");
const cloudinary = require('cloudinary');
const ErrorHandler = require("../utils/errorHandler");
const productModel = require("../models/productModel");


exports.createProduct = catchAsyncErrors(async function (req, res) {
    let images = req.body.images;

    if (!Array.isArray(images)) {
        next(new ErrorHandler("Images must be sent an array.",400));
    }

  let imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images=imagesLinks;
  const product= await productModel.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
})

exports.getAllProducts = catchAsyncErrors(async (req, res) => {
 
    const { page = 1, limit = 10, keyword = '' } = req.query;
    
    // Create search filter
    const filter = {
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } }
      ]
    };

    // Execute query with pagination
    const [products, totalProducts] = await Promise.all([
      productModel.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .exec(),
        productModel.countDocuments(filter)
    ]);

    res.json({
      products,
      pagination: {
        totalProducts,
        currentPage: Number(page),
        totalPages: Math.ceil(totalProducts / limit),
        productsPerPage: Number(limit)
      }
    });

 
})
exports.getSearchedProducts = catchAsyncErrors(async (req, res) => {
 
    const { keyword = '' } = req.query;
    
    // Create search filter
    const filter = {
      name: { $regex: keyword, $options: 'i' }
    };

    // Execute query with pagination
    const products = await 
      productModel.find(filter)
        .sort({ createdAt: -1 })
        .limit(Number(5))
        
    

    res.json({
      products,
      success:true
    });

 
})
exports.getCategoryWiseProducts = catchAsyncErrors(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    keyword = '',
    minPrice,
    maxPrice,
    ratings,
    sort,
    inStock 
  } = req.query;

  const filter = {};

  if (keyword!=="all") {
    filter.category = { $regex: keyword, $options: 'i' };
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Rating filter
  if (ratings) {
    filter.ratings = { $gte: Number(ratings) };
  }

  // Stock filter
  if (inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort) {
    const [field, order] = sort.split(',');
    sortOption = { [field]: order === 'asc' ? 1 : -1 };
  }

  const [products, totalProducts] = await Promise.all([
    productModel.find(filter)
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .exec(),
    productModel.countDocuments(filter)
  ]);

  res.json({
    products,
    pagination: {
      totalProducts,
      currentPage: Number(page),
      totalPages: Math.ceil(totalProducts / limit),
      productsPerPage: Number(limit)
    }
  });
});


// Get All Product (Admin)
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await productModel.find();
console.log("in product",products)
  res.status(200).json({
    success: true,
    products,
  });
});


exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});

exports.updateProduct=catchAsyncErrors(
  async function(req,res){
    console.log("updating product")
    const product=await productModel.findById(req.params.id);
    if (!product) {
      return next(new ErrorHandler("Product not found", 404));
    }
    let images = req.body.images;

    

    let imagesLinks = [];
  if(images!== undefined){
    for (let i = 0; i < product.images.length; i++) {
      await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }
  for (let i = 0; i < images.length; i++) {
    const result = await cloudinary.v2.uploader.upload(images[i], {
      folder: "products",
    });
    imagesLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }
  req.body.images=imagesLinks;
  }
  console.log(req.body,"req.body")
  const newproduct= await productModel.findByIdAndUpdate(req.params.id,req.body,{
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  console.log(newproduct,"rnewproduct")
  if (!newproduct) {
    return next(new ErrorHandler("Failed to update product", 500));
  }
  res.status(201).json({
    success: true,
    newproduct,
  });
  }
)


exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await productModel.findById(req.params.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  // Deleting Images From Cloudinary
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.v2.uploader.destroy(product.images[i].public_id);
  }

  await productModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product Delete Successfully",
  });
});

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
console.log(rating, comment, productId,"rating")
  // Validate input
  if (!rating || !comment || !productId) {
    return res.status(400).json({
      success: false,
      message: 'Please provide rating, comment, and product ID.',
    });
  }

  // Create review object
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  // Find the product
  const product = await productModel.findById(productId).populate({
    path: 'reviews.user'});;
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found.',
    });
  }

  // Check if the user has already reviewed the product
  const isReviewed = product.reviews.find(
    (rev) =>{ re= rev.user.equals(req.user._id);
      return re;
    }
    );
    
    if (isReviewed) {
      // Update existing review
      product.reviews.forEach((rev) => {
        if (rev.user.equals(req.user._id)) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
      // console.log(product.reviews,"already reviewed");

  } else {
    // Add new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  const totalRating = product.reviews.reduce((acc, rev) => acc + rev.rating, 0);
  product.ratings = totalRating / product.reviews.length;

  // Save the product
  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Review added successfully.',
    product
  });
});
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const { productId, reviewId } = req.params;
  
  // Find the product first
  const product = await productModel.findById(productId);
  if (!product) {
      return next(new ErrorHandler("Product not found", 404));
  }

  // Find the review to check ownership
  const review = product.reviews.find(
      rev => rev._id.toString() === reviewId.toString()
  );

  if (!review) {
      return next(new ErrorHandler("Review not found", 404));
  }

  // Check if the current user is the review author
  if (review.user.toString() !== req.user._id.toString()) {
      return next(new ErrorHandler("You are not authorized to delete this review", 403));
  }

  // Filter out the review
  const updatedReviews = product.reviews.filter(
      rev => rev._id.toString() !== reviewId.toString()
  );

  // Calculate new ratings
  const ratings = updatedReviews.length > 0 
      ? updatedReviews.reduce((acc, rev) => acc + rev.rating, 0) / updatedReviews.length
      : 0;

  const numOfReviews = updatedReviews.length;

  // Update the product
  const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      {
          reviews: updatedReviews,
          ratings,
          numOfReviews
      },
      {
          new: true,
          runValidators: true,
          useFindAndModify: false
      }
  );

  res.status(200).json({
      success: true,
      product: updatedProduct
  });
});