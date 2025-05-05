import PlusSvg from "./PlusSvg";

const SectionSvg = ({ Croffset }) => {
  return (
    <>
      <PlusSvg
        className={`hidden absolute top-[4.989rem] left-[1.5625rem] ${
          Croffset && Croffset
        } pointer-events-none lg:block xl:left-[0.9rem]`}
      />

      <PlusSvg
        className={`hidden absolute  top-[4.989rem] right-[1.5625rem] ${
          Croffset && Croffset
        } pointer-events-none lg:block xl:right-[2.2rem]`}
      />
    </>
  );
};

export default SectionSvg;