import Section from "./Section";
import smallSphere from "../assets/Span/off.png";
import stars from "../assets/Span/stars.svg";

const Span = () => {
  return (
    <Section>
      <div className="container relative z-2 -my-15">
        <div className="relative flex justify-center mb-12"> 
          <div className="flex justify-center items-center"> 
            <img
              src={smallSphere}
              className="relative z-1 w-[300px] h-[300px] object-contain"
              alt="Sphere"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 w-[60rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src={stars}
              className="w-full"
              width={950}
              height={500}
              alt="Stars"
            />
          </div>
        </div>
      </div>
    </Section>
  );
};

export default Span;