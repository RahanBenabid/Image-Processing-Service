import { useState, useEffect } from "react";
import Section from "./Section";
import { testimonials } from "../constants";
import Arrow_left from "../assets/svg/Arrow_left";
import Arrow_right from "../assets/svg/Arrow_right";

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const length = testimonials.length;

  const previous = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  const next = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);

    return () => clearInterval(interval);
  }, [current]);

  return (
    <Section className=" ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center">
    
          <div className="w-full max-w-4xl">
            {testimonials.map((item, index) => (
              <div
                key={index}
                className={`transition-all duration-500 ${
                  index === current ? "block" : "hidden"
                }`}
              >
                <div className="bg-n-11 rounded-2xl shadow-lg p-8 md:p-10 lg:p-12">
                 
                 <div className="pb-8 flex items-start gap-4">
                    <img
                      src="https://assets.website-files.com/5fef5619b640934b33c2385e/5ff6a53da27356854576b920_Group%2058.svg"
                      alt="Quote"
                      className="w-6 h-6 mt-1 flex-shrink-0"
                    />
                    <h2 className="text-n-1 text-lg md:text-xl lg:text-2xl font-bold leading-tight">
                      {item.content_text}
                    </h2>
                  </div>
                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
                   
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="flex-shrink-0">
                        <img
                          className="w-14 h-14 border-2 rounded-full border-color-3 p-1 object-cover"
                          src={item.img}
                          alt={`${item.testimonial_name} profile`}
                        />
                      </div>
                      <div>
                        <h6 className="text-n-1 text-lg font-semibold">
                          {item.testimonial_name}
                        </h6>
                        <span className="text-color-1 text-sm">
                          {item.text_block}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 mt-6 sm:mt-0">
                      <button
                        onClick={previous}
                        className="bg-n-12 hover:bg-color-3 transition-colors rounded-xl p-4 flex items-center justify-center text-n-1"
                        aria-label="Previous testimonial"
                      >
                        <Arrow_left />
                      </button>
                      
                      <button
                        onClick={next}
                        className="bg-n-12 hover:bg-color-3 transition-colors rounded-xl p-4 flex items-center justify-center text-n-1"
                        aria-label="Next testimonial"
                      >
                        <Arrow_right />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
         
          <div className="mt-8 flex justify-center gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === current ? "w-6 bg-color-3" : "bg-n-6"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;