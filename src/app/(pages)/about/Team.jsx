const TeamSection = () => {
    const teamMembers = [
      {
        name: "Qasim Abbas",
        role: "Founder & CEO",
        description: "Passionate about connecting people with the best dining experiences.",
        image: "/assets/ceo-img.jpg",
      },
      {
        name: "Abu-Bakar Riaz",
        role: "Marketing Director",
        description: "Focused on crafting strategies to connect diners and restaurants.",
        image: "/assets/marketing-diector-img.jpg",
      },
      {
        name: "Zain Malik",
        role: "Operations Manager",
        description: "Oversees daily operations ensuring smooth user experience.",
        image: "/assets/operation-manager-img.jpg",
      },
      {
        name: "Mobeen Akhtar",
        role: "Head of Customer Support",
        description: "Ensures our users have a great experience with every booking.",
        image: "/assets/customer-support-img.jpg",
      },
      {
        name: "Fahad Qaiser",
        role: "Product Developer",
        description: "Passionate about building and improving the Dine Reserve platform.",
        image: "/assets/it-img.jpg",
      },
      {
        name: "Ibrahim Ali",
        role: "Business Analyst",
        description: "Analyzes user data to help improve our services.",
        image: "/assets/buisness-analyst-img.jpg",
      },
    ];
  
    return (
      <section className="py-10 px-6 mx-auto max-w-6xl bg-white text-center">
        {/* About Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#6b0000] mb-4">
            Story Behind Dine Reserve
          </h2>
          <p className="text-gray-700 text-lg">
            Dine Reserve was founded with the belief that dining out should be a seamless 
            and stress-free experience. From a small idea to a leading platform, we've grown 
            with the aim of providing better restaurant booking options for everyone.
          </p>
        </div>
  
        {/* Meet Our Team */}
        <h2 className="text-3xl md:text-4xl font-bold text-[#6b0000] mb-8">
          Meet Our Team
        </h2>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className=" text-center">
              <div className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-72 h-72 object-cover rounded-full mx-auto shadow-lg border-4 border-gray-200"
                />
              </div>
              <h3 className="text-xl font-semibold text-[#6b0000] mt-4">{member.name}</h3>
              <p className="text-sm font-medium text-gray-600">{member.role}</p>
              <p className="text-gray-700 mt-2">{member.description}</p>
            </div>
          ))}
        </div>
      </section>
    );
  };
  
  export default TeamSection;
  