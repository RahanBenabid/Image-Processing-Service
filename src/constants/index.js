import file02 from "../assets/file-02.svg";
import homeSmile from "../assets/home-smile.svg";
import plusSquare from "../assets/plus-square.svg";
import searchMd from "../assets/search-md.svg";
import notification2 from "../assets/notification/image-2.png";
import notification3 from "../assets/notification/image-3.png";
import notification4 from "../assets/notification/image-4.png";
import benefitIcon1 from "../assets/benefits/icon-1.svg";
import benefitIcon2 from "../assets/benefits/icon-2.svg";
import benefitIcon3 from "../assets/benefits/icon-3.svg";
import benefitIcon4 from "../assets/benefits/icon-4.svg";
import benefitImage2 from "../assets/benefits/image.jpg";
import facebook from "../assets/socials/facebook.svg";
import instagram from "../assets/socials/instagram.svg";
import twitter from "../assets/socials/twitter.svg";
import telegram from "../assets/socials/telegram.svg";
import discordBlack from "../assets/socials/discord.svg";
import speed from "../assets/testimonials/speed.png";
import kanyewest from "../assets/testimonials/kanyewest.png";
import pewdiepie from "../assets/testimonials/pewdiepie.png";
import nikocadeo from "../assets/testimonials/nikocado.png";
import compress from "../assets/services/compress.png";
import resize from "../assets/services/resize.png";
import rotate from "../assets/services/rotate.png";
import watermark from "../assets/services/watermark.png";
import filters from "../assets/services/filters.png";
import transform from "../assets/services/transform.png";
import crop from "../assets/services/crop.png";

export const navigation = [
  {
    id: "0",
    title: "Services",
    url: "#services",
    logged: false,
  },
  {
    id: "1",
    title: "New Account",
    url: "/register",
    logged: false,
  },
  {
    id: "2",
    title: "Sign in",
    url: "/login",
    logged: false,
  },
  {
    id: "3",
    title: "Account",
    url: "/profile",
    logged: true,
  },
];

export const heroIcons = [homeSmile, file02, searchMd, plusSquare];
export const notificationImages = [notification4, notification3, notification2];
export const benefits = [
  {
    id: "0",
    title: "Cropping",
    text: "Lets users precisely trim images to focus on what matters without needing complex tools.",
    backgroundUrl: "./src/assets/benefits/card-1.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    light: true,
    icon: crop,
  },
  {
    id: "1",
    title: "Watermarking",
    text: "Lets users easily add custom watermarks to protect their images without any hassle.",
    backgroundUrl: "./src/assets/benefits/card-2.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    icon: watermark,
  },
  {
    id: "2",
    title: "Applying filters",
    text: "Lets users instantly enhance photos with stylish filters without navigating complicated menus.",
    backgroundUrl: "./src/assets/benefits/card-3.svg",
    iconUrl: benefitIcon3,
    imageUrl: benefitImage2,
    light: true,
    icon: filters,
  },
  {
    id: "3",
    title: "Resizing",
    text: "Lets users effortlessly adjust image dimensions to fit any need without quality loss.",
    backgroundUrl: "./src/assets/benefits/card-4.svg",
    iconUrl: benefitIcon4,
    imageUrl: benefitImage2,
    icon: resize,
  },
  {
    id: "4",
    title: "Rotation",
    text: "Lets users quickly reorient images to the perfect angle without extra steps.",
    backgroundUrl: "./src/assets/benefits/card-5.svg",
    iconUrl: benefitIcon1,
    imageUrl: benefitImage2,
    light: true,
    icon: rotate,
  },
  {
    id: "5",
    title: "Compressing",
    text: "Lets users shrink image file sizes for faster sharing without sacrificing clarity.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    icon: compress,
  },
  {
    id: "6",
    title: "Transforming",
    text: "Lets users seamlessly convert image formats for compatibility without juggling multiple programs.",
    backgroundUrl: "./src/assets/benefits/card-6.svg",
    iconUrl: benefitIcon2,
    imageUrl: benefitImage2,
    light: true,
    icon: transform,
  },
];
export const socials = [
  {
    id: "0",
    title: "Discord",
    iconUrl: discordBlack,
    url: "#",
  },
  {
    id: "1",
    title: "Twitter",
    iconUrl: twitter,
    url: "#",
  },
  {
    id: "2",
    title: "Instagram",
    iconUrl: instagram,
    url: "#",
  },
  {
    id: "3",
    title: "Telegram",
    iconUrl: telegram,
    url: "#",
  },
  {
    id: "4",
    title: "Facebook",
    iconUrl: facebook,
    url: "#",
  },
];

export const testimonials = [
  {
    id: "0",
    img: kanyewest,
    content_text:
      "This tool is a lifesaver! Resizing, cropping, and rotating images is so easy, and the watermarking feature is perfect for protecting my work. It’s fast, user-friendly, and delivers great results every time.",
    testimonial_name: "Kanye west",
    text_block: "Graphic Designer",
  },
  {
    id: "1",
    img: pewdiepie,
    content_text:
      "I love how simple and efficient this tool is. The filters and transformations give my photos a polished look, and the compression keeps file sizes small without losing quality. Highly recommended!",
    testimonial_name: "PewDiePie",
    text_block: "Social Media Manager",
  },
  {
    id: "2",
    img: speed,
    content_text:
      "This tool handles everything—resizing, cropping, watermarking, and more! It's intuitive, fast, and saves me from switching between apps. Perfect for anyone working with images.",
    testimonial_name: "Speed",
    text_block: "Photographer",
  },
  {
    id: "3",
    img: nikocadeo,
    content_text:
      "Super versatile and easy to use! The filters and transformations are fantastic, and the watermarking keeps my images secure. It’s my go-to for all image editing needs.",
    testimonial_name: "Nikocado Avocado",
    text_block: "Content Creator",
  },
];
