const sendToken =  async (user, statusCode, res) => {
    const token = await user.getJWTToken();
    // options for cookie
    const options = {
      expires:process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: 'None',
        secure: true,
    };
  
    res.status(statusCode).cookie("token", token, options).json({
      success: true,
      user,
      token,
    });
  };
  
  module.exports = sendToken;
