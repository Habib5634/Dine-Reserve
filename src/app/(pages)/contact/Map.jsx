import React from "react";

const GoogleMap = () => {
  return (
    <div className="flex flex-col items-center p-4 max-w-6xl mx-auto py-12 px-6">
      <h2 className='text-4xl font-bold text-redish text-center mb-6'>Visit Us</h2>
      <div className="w-full max-w-4xl">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13284.547791609698!2d73.21596408961486!3d34.17129932342912!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e110a0b68b50b3%3A0x7e7038e6763560ea!2sAbbottabad%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1712345678901"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleMap;
