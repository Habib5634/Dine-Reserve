const ContactUs = () => {
    return (
      <section className="max-w-6xl py-10 px-6 mx-auto">
        {/* Contact Heading */}
      
            <h1 className='text-4xl font-bold text-redish text-center'>About Us</h1>
            <p className='text-lg text-redish text-center mb-10'>Learn more about Dine Reserve. We strive to make dining easier for everyone.</p>


       
  
        {/* Contact Form */}
        <div className="bg-white border border-redish rounded-lg p-6 md:p-8 mt-8 shadow-md max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-redish text-center mb-4">
            Send Us a Message
          </h3>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="Your Full Name"
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-redish focus:ring-redish"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Email Address</label>
              <input
                type="email"
                placeholder="Your Email Address"
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-redish focus:ring-redish"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Contact Number</label>
              <div className="flex gap-2">
                <select className="border-gray-300 p-2 rounded-md shadow-sm focus:border-redish focus:ring-redish">
                  <option>+1 (USA)</option>
                  <option>+92 (Pakistan)</option>
                  <option>+44 (UK)</option>
                </select>
                <input
                  type="text"
                  placeholder="Your Contact Number"
                  className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-redish focus:ring-redish"
                />
              </div>
            </div>
            <div>
              <label className="block font-semibold text-gray-700">Message</label>
              <textarea
                rows="4"
                placeholder="Your Message"
                className="w-full border-gray-300 p-2 rounded-md shadow-sm focus:border-redish focus:ring-redish"
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-redish text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Submit
            </button>
          </form>
        </div>
  
        {/* Contact Information */}
        <div className="mt-10 text-center">
          <h3 className="text-2xl font-bold text-redish mb-4">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
            <div>
              <h4 className="font-semibold text-redish">Address</h4>
              <p>Dine Reserve, Shop: D17, Al-Imtiaz Plaza, Abbottabad</p>
            </div>
            <div>
              <h4 className="font-semibold text-redish">Phone</h4>
              <p>+(0992) 456-789</p>
            </div>
            <div>
              <h4 className="font-semibold text-redish">Email</h4>
              <p>support@dinereserve.com</p>
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default ContactUs;
  