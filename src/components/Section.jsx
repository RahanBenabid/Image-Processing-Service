import SectionSvg from '../assets/svg/SectionSvg';

const Section = ({className, id, crosses, offset, paddings, children}) => {
  return (
    <div id={id} className={`relative ${paddings || `py-10 lg:py-16 xl:py-20 ${crosses ? 'lg:py-32 xl:py-40':'' } ${className || ''} `}`}>
      {children}

      <div className="hidden absolute top-0 left-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-7.5 xl:right-10" />
      <div className="hidden absolute top-0 right-5 w-0.25 h-full bg-stroke-1 pointer-events-none md:block lg:right-7.5 xl:right-10" />
      {crosses && (
        <>
          <div className={`hidden absolute top-0 left-7.5 right-7.5 h-0.25 bg-stroke-1 
            ${offset && offset} pointer-events-none lg:block xl:left-7 right-7`}>

            </div>
          <SectionSvg offset={offset}/>
        
        </>
      )}
    </div>
  )
}

export default Section
