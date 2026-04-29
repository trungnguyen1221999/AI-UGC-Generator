// Infer how the person should interact with the product based on its description
// Xác định cách người dùng tương tác với sản phẩm dựa theo mô tả
export const getProductUsageInstruction = (productName: string, productDescription: string): string => {
  const text = `${productName} ${productDescription}`.toLowerCase();

  if (/shoe|sneaker|boot|sandal/.test(text))
    return 'The person is WEARING the shoes/footwear on their feet. Show full or partial lower body.';

  if (/bag|handbag|purse|backpack/.test(text))
    return 'The person is WEARING the bag — handbag on shoulder/arm, backpack on back. Do not show them holding it out.';

  if (/glasses|sunglasses|eyewear/.test(text))
    return 'The person is WEARING the glasses on their face. Show a natural facial expression.';

  if (/watch|bracelet|necklace|ring|jewelry/.test(text))
    return 'The person is WEARING the accessory on the appropriate body part (wrist, neck, finger).';

  if (/hat|cap|helmet/.test(text))
    return 'The person is WEARING the hat/cap on their head naturally.';

  if (/shirt|dress|jacket|pants|outfit|clothing/.test(text))
    return 'The person is WEARING the clothing item. Show the full outfit naturally.';

  if (/serum|cream|moisturizer|lipstick|makeup|skincare/.test(text))
    return 'The person is APPLYING the product directly to their skin or face. Show the application gesture naturally.';

  if (/phone|laptop|tablet|headphone|earphone/.test(text))
    return 'The person is ACTIVELY USING the device — holding phone to ear, wearing headphones, typing on laptop.';

  if (/drink|beverage|coffee|tea|juice/.test(text))
    return 'The person is DRINKING or holding the beverage naturally, about to take a sip.';

  if (/food|snack|meal/.test(text))
    return 'The person is EATING or holding the food item naturally, about to take a bite.';

  // Default — generic holding but product must be visible
  // Mặc định — cầm sản phẩm nhưng phải hiển thị rõ
  return 'The person is holding the product naturally at chest level, with the product label/face clearly visible to camera.';
};