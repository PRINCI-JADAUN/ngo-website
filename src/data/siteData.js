export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#about" },
  { label: "Programs", to: "/#programs" },
  { label: "Gallery", to: "/gallery" },
  { label: "Stories", to: "/stories" },
  { label: "Contact", to: "/contact" },
];

const ngoImages = {
  heroRescue: "/images/ngo/hero-rescue.jpg",
  heroShelter: "/images/ngo/hero-shelter.jpg",
  heroCommunity: "/images/ngo/hero-community.jpg",
  aboutCare: "/images/ngo/about-care.jpg",
  mission: "/images/ngo/rescue.jpg",
  vision: "/images/ngo/hero-community.jpg",
  shelter: "/images/ngo/shelter.jpg",
  feeding: "/images/ngo/feeding.jpg",
  abc: "/images/ngo/abc-care.jpg",
  strayCare: "/images/ngo/stray-care.jpg",
  rescue: "/images/ngo/rescue.jpg",
  foster: "/images/ngo/foster.jpg",
  adoption: "/images/ngo/adoption.jpg",
  awareness: "/images/ngo/awareness.jpg",
  birdCare: "/images/ngo/bird-care.jpg",
  dogPortrait: "/images/ngo/dog-portrait.jpg",
  puppy: "/images/ngo/puppy.jpg",
  // Dedicated service card images (downloaded from Unsplash)
  serviceShelter: "/images/ngo/service-shelter.jpg",
  serviceDoroti:  "/images/ngo/service-doroti.jpg",
  serviceAbc:     "/images/ngo/service-abc.jpg",
  serviceFeeding: "/images/ngo/service-feeding.jpg",
  serviceRescue:  "/images/ngo/service-rescue.jpg",
  serviceFoster:  "/images/ngo/service-foster.jpg",
};

export const defaultSiteContent = {
  org: {
    name: "Wings & Tails",
    legalType: "NGO / Section 8 Company",
    registrationLine: "Registered under the Companies Act, 2013",
    location: "Greater Noida West (Techzone 7)",
    phone: "+91-9891001443",
    email: "info@wingsandtails.co.in",
    hours: "10:00 AM - 7:00 PM",
    website: "www.wingsandtails.co.in",
    founderLine: "Founded as a self-funded initiative and now serving animals and birds for over 20 years.",
    tagline: "Compassion for every paw, wing, and life in need.",
    keyMessages: [
      "Adopt, don't shop",
      "Feed strays daily",
      "Sterilization is the real solution",
      "Compassion + awareness",
    ],
  },
  heroSlides: [
    {
      image: ngoImages.heroRescue,
      animation: "rescue",
      title: "A hand reaches out when an animal is in danger",
      text: "Every rescue begins with compassion: a person notices distress, moves closer with care, and helps a frightened life feel safe again.",
    },
    {
      image: ngoImages.heroShelter,
      animation: "care",
      title: "Daily food and water build trust",
      text: "A simple act of feeding can turn fear into friendship and remind communities that animals depend on human kindness.",
    },
    {
      image: ngoImages.heroCommunity,
      animation: "home",
      title: "A rescued animal finds a family",
      text: "Adoption changes both lives: an animal receives a home, and a human family gains loyalty, joy, and a lifelong bond.",
    },
    {
      image: ngoImages.feeding, // Using existing image to represent video content
      animation: "care", // Reusing existing animation for visual consistency
      title: "Compassion in Action: Feeding Our Feathered Friends",
      text: "Witness the simple joy of humans feeding birds, a small act that fosters connection and care for nature.",
      type: "video", // Indicates this slide is intended for video
    },
    {
      image: ngoImages.dogPortrait, // Using existing image to represent video content
      animation: "home", // Reusing existing animation for visual consistency
      title: "Playful Paws: Dogs and Humans Building Bonds",
      text: "Experience the heartwarming interaction as dogs play freely with humans, showcasing pure happiness and companionship.",
      type: "video", // Indicates this slide is intended for video
    },
  ],
  about: {
    title: "About Wings & Tails",
    intro: [
      "Wings & Tails is a registered Section 8 company working for animals and birds in Greater Noida West. What began as a self-funded effort has grown into a long-term mission rooted in compassion, awareness, and practical action.",
      "For over 20 years, we have worked to change how society treats animals and birds, reduce cruelty, and create systems of care that protect vulnerable species with dignity.",
      "Our work combines rescue operations, feeding, sterilization, shelter care, foster support, and adoption facilitation so that both immediate suffering and long-term challenges can be addressed together.",
    ],
    founderStory:
      "Founded by people who chose action over indifference, Wings & Tails was built to prove that humane treatment, awareness, and responsibility can reshape the relationship between humans and animals.",
    image: ngoImages.aboutCare,
  },
  mission:
    "To build a society where humans protect animals and birds, and where cruelty and injustice toward every species are actively eliminated.",
  vision:
    "To create a world where animals and birds live equally and the natural balance between species is respected and maintained.",
  missionImage: ngoImages.rescue,
  visionImage: ngoImages.adoption,
  quickActions: [
    { icon: "fas fa-heart", title: "Adopt, don't shop" },
    { icon: "fas fa-bone red", title: "Feed 2 rotis daily" },
    { icon: "fas fa-syringe yell", title: "Support sterilization" },
    { icon: "fas fa-hands-helping blu", title: "Join rescue efforts" },
  ],
  coreActivities: [
    "Adoption facilitation",
    "Sterilization & neutering",
    "Feeding stray animals",
    "Awareness campaigns",
    "Rescue operations",
  ],
  services: [
    {
      image: ngoImages.serviceShelter,
      title: "Animal Shelter (The Home)",
      raised: "Safe & clean",
      goal: "Solar-powered model",
      description:
        "A temperature-controlled shelter that stays warm in winter and cool in summer, running on a solar-powered sustainable model with dedicated care staff.",
    },
    {
      image: ngoImages.serviceDoroti,
      title: "Do-Roti Challenge",
      raised: "2 rotis daily",
      goal: "Community movement",
      description:
        "A grassroots public movement encouraging every household to feed two rotis daily to stray animals — turning compassion into a daily community habit.",
    },
    {
      image: ngoImages.serviceAbc,
      title: "Animal Birth Control (ABC)",
      raised: "Pre-check to post-care",
      goal: "Long-term solution",
      description:
        "Sterilization and neutering support covering pre-operative checks, surgery, and five days of post-operative care to humanely manage stray populations.",
    },
    {
      image: ngoImages.serviceFeeding,
      title: "Stray Feeding Program",
      raised: "30+ dogs daily",
      goal: "Food, water & care",
      description:
        "Daily food, clean water, and basic medical attention for stray dogs across Greater Noida West — ensuring no animal goes hungry on our watch.",
    },
    {
      image: ngoImages.serviceRescue,
      title: "Rescue Services",
      raised: "Rapid response",
      goal: "24/7 rescue support",
      description:
        "Emergency rescue for animals trapped in drains, pits, kite strings, and dangerous situations — with trained volunteers responding quickly to every call.",
    },
    {
      image: ngoImages.serviceFoster,
      title: "Foster Care Program",
      raised: "Temporary homes",
      goal: "Emotional healing",
      description:
        "Short-term foster homes for abandoned and lost pets, providing emotional rehabilitation, health observation, and safe recovery before adoption or reunification.",
    },
  ],
  stats: [
    { value: "20+", label: "Years of service" },
    { value: "5", label: "Core action pillars" },
    { value: "30", label: "Stray dogs fed daily" },
    { value: "100%", label: "Compassion-driven mission" },
  ],
  pets: [
    {
      id: "pet-husna",
      name: "Husna",
      age: "~3 yrs",
      breed: "Indian Pariah Mix",
      traits: ["Gentle", "Loves cuddles", "Good with kids"],
      status: "Available",
      image: ngoImages.dogPortrait,
      description: "Husna is a sweet and gentle soul who loves being around people. She is great with children and other animals.",
    },
    {
      id: "pet-bablu",
      name: "Bablu",
      age: "~5 yrs",
      breed: "Indian Pariah",
      traits: ["Calm", "House-trained", "Loyal"],
      status: "Available",
      image: ngoImages.strayCare,
      description: "Bablu is a calm and loyal companion who is already house-trained and ready for a forever home.",
    },
    {
      id: "pet-kinza",
      name: "Kinza",
      age: "~1 yr",
      breed: "Mixed Breed Puppy",
      traits: ["Playful", "High energy", "Curious"],
      status: "Foster",
      image: ngoImages.puppy,
      description: "Kinza is a curious and energetic puppy currently in foster care, looking for an active family.",
    },
    {
      id: "pet-moti",
      name: "Moti",
      age: "~4 yrs",
      breed: "Indian Pariah",
      traits: ["Friendly", "Quiet", "Loves walks"],
      status: "Available",
      image: ngoImages.shelter,
      description: "Moti is a quiet and friendly dog who enjoys long walks and calm environments.",
    },
    {
      id: "pet-bella",
      name: "Bella",
      age: "~2 yrs",
      breed: "Mixed Breed",
      traits: ["Affectionate", "Recovering", "Needs care"],
      status: "Medical",
      image: ngoImages.foster,
      description: "Bella is currently recovering from an injury and needs a patient, caring home once she is fully healed.",
    },
  ],
  sponsorship: {
    title: "Adoption & Sponsorship",
    description:
      "Sponsor a dog and help us cover shelter, food, medical care, staff, and veterinary support for rescued animals.",
    dogs: [
      { name: "Husna", image: ngoImages.dogPortrait, note: "Waiting for sponsor support" },
      { name: "Bablu", image: ngoImages.strayCare, note: "Needs food and treatment support" },
      { name: "Kinza", image: ngoImages.puppy, note: "Ready for foster or sponsor" },
      { name: "Moti", image: ngoImages.shelter, note: "Long-term shelter care" },
      { name: "Bella", image: ngoImages.foster, note: "Sponsor medical recovery" },
    ],
  },
  team: [
    { image: ngoImages.awareness, name: "Dr. Ravi Ramakrishnan", role: "Founder" },
    { image: ngoImages.adoption, name: "Shreevidya Ravi", role: "Co-Founder" },
    { image: ngoImages.shelter, name: "Ritesh Kumar", role: "Facilities Head" },
    { image: ngoImages.rescue, name: "Rohit Chaudhary", role: "Head of Animal Welfare" },
  ],
  stories: [
    {
      image: ngoImages.feeding,
      date: "April 6, 2026",
      title: "Why feeding stray animals every day matters",
      excerpt:
        "Regular food and water reduce suffering immediately and build a culture where compassion becomes part of daily life.",
    },
    {
      image: ngoImages.abc,
      date: "April 1, 2026",
      title: "Sterilization is the real long-term solution",
      excerpt:
        "Animal birth control programs protect animals, reduce suffering, and help communities manage population growth humanely.",
    },
    {
      image: ngoImages.rescue,
      date: "March 24, 2026",
      title: "Rescue work starts with awareness",
      excerpt:
        "When communities know how to respond to injured or trapped animals, more lives are saved before situations become fatal.",
    },
    {
      image: ngoImages.adoption,
      date: "March 19, 2026",
      title: "Adopt, don't shop: building better homes for rescued animals",
      excerpt:
        "Adoption gives abandoned pets a second chance while reducing commercial breeding and avoidable neglect.",
    },
    {
      image: ngoImages.shelter,
      date: "March 8, 2026",
      title: "Inside The Home: creating a humane shelter space",
      excerpt:
        "A clean, self-sustained, temperature-controlled shelter makes recovery safer and far less stressful for rescued animals.",
    },
    {
      image: ngoImages.strayCare,
      date: "February 28, 2026",
      title: "Do-Roti Challenge: small action, daily impact",
      excerpt:
        "Two rotis a day may feel simple, but community feeding habits can significantly reduce hunger among strays.",
    },
  ],
  galleryCategories: [
    { label: "All", value: "all" },
    { label: "Rescue", value: "rescue" },
    { label: "Shelter", value: "shelter" },
    { label: "Feeding", value: "feeding" },
    { label: "Awareness", value: "awareness" },
  ],
  galleryItems: [
    { image: ngoImages.rescue, category: "rescue", title: "Emergency rescue support" },
    { image: ngoImages.shelter, category: "shelter", title: "Recovery space inside The Home" },
    { image: ngoImages.feeding, category: "feeding", title: "Daily stray feeding route" },
    { image: ngoImages.awareness, category: "awareness", title: "Community awareness campaign" },
    { image: ngoImages.rescue, category: "rescue", title: "Swift action for trapped animals" },
    { image: ngoImages.shelter, category: "shelter", title: "Comfort and care in our shelter" },
    { image: ngoImages.feeding, category: "feeding", title: "Nourishing strays with daily meals" },
    { image: ngoImages.awareness, category: "awareness", title: "Educating for a kinder world" },
    { image: ngoImages.birdCare, category: "rescue", title: "Protecting our avian friends" },
    { image: ngoImages.abc, category: "shelter", title: "Post-surgery recovery support" },
    { image: ngoImages.strayCare, category: "feeding", title: "Hydration and sustenance for strays" },
    { image: ngoImages.adoption, category: "awareness", title: "Promoting responsible pet ownership" },
    { image: ngoImages.birdCare, category: "rescue", title: "Bird care and protection" },
    { image: ngoImages.abc, category: "shelter", title: "Post-treatment care" },
    { image: ngoImages.strayCare, category: "feeding", title: "Water and food support" },
    { image: ngoImages.adoption, category: "awareness", title: "Compassion and adoption outreach" },
  ],
  stories: [
    {
      image: ngoImages.feeding,
      date: "April 6, 2026",
      title: "Why feeding stray animals every day matters",
      excerpt:
        "Regular food and water reduce suffering immediately and build a culture where compassion becomes part of daily life.",
    },
    {
      image: ngoImages.abc,
      date: "April 1, 2026",
      title: "Sterilization is the real long-term solution",
      excerpt:
        "Animal birth control programs protect animals, reduce suffering, and help communities manage population growth humanely.",
    },
    {
      image: ngoImages.rescue,
      date: "March 24, 2026",
      title: "Rescue work starts with awareness",
      excerpt:
        "When communities know how to respond to injured or trapped animals, more lives are saved before situations become fatal.",
    },
    {
      image: ngoImages.adoption,
      date: "March 19, 2026",
      title: "Adopt, don't shop: building better homes for rescued animals",
      excerpt:
        "Adoption gives abandoned pets a second chance while reducing commercial breeding and avoidable neglect.",
    },
    {
      image: ngoImages.shelter,
      date: "March 8, 2026",
      title: "Inside The Home: creating a humane shelter space",
      excerpt:
        "A clean, self-sustained, temperature-controlled shelter makes recovery safer and far less stressful for rescued animals.",
    },
    {
      image: ngoImages.strayCare,
      date: "February 28, 2026",
      title: "Do-Roti Challenge: small action, daily impact",
      excerpt:
        "Two rotis a day may feel simple, but community feeding habits can significantly reduce hunger among strays.",
    },
    {
      image: ngoImages.puppy,
      date: "May 1, 2026",
      title: "The Journey of a Rescued Puppy: From Fear to Family",
      excerpt: "Follow the heartwarming transformation of a puppy rescued from the streets, finding love and a forever home.",
    },
    {
      image: ngoImages.birdCare,
      date: "May 5, 2026",
      title: "Wings of Hope: Rehabilitating Injured Birds Back to the Sky",
      excerpt: "Learn about our dedicated efforts in rescuing and rehabilitating injured birds, giving them a second chance at flight.",
    },
    {
      image: ngoImages.foster,
      date: "May 10, 2026",
      title: "The Unsung Heroes: Stories from Our Foster Families",
      excerpt: "Meet the incredible foster parents who open their homes and hearts to animals in need, providing crucial temporary care.",
    },
  ],
  forms: {
    contactIntro:
      "Reach out for rescue support, volunteer interest, donations, foster needs, adoption help, or general questions.",
    volunteerAreas: [
      "Rescue support",
      "Shelter help",
      "Feeding drives",
      "Awareness campaigns",
      "Fundraising",
    ],
    donationTypes: [
      "General donation",
      "Shelter support",
      "Medical care",
      "Feeding support",
      "Rescue operations",
    ],
  },
};
