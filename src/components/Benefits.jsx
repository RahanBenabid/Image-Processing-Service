import Section from './Section'
import Heading from './Heading'
import { benefits } from '../constants'
import Arrow from '../assets/svg/Arrow'
import ClipPath from "../assets/svg/ClipPath";
import { GradientLight } from './design/Benefits'


const Benefits = () => {
  // benefits.map((item)=>console.log(item.title))
  return (
    <Section >
      <div className="container relative z-2">
        <Heading className="mx-auto md:max-w-md lg:max-w-3xl text-center" title="Quick Fixes for Every Frame with jpegHell"/>

        <div className="flex justify-around flex-wrap gap-10 mb-10">
            {benefits.map((item, index)=>{
              return (<div key={index} className="block relative p-0.5 bg-no-repeat bg-[length:100%_100%] md:max-w-[19rem] lg:max-w-[22rem]"  style={{
                backgroundImage: `url(${item.backgroundUrl})`, 
                backgroundRepeat: 'no-repeat'
              }}>
                <div className="relative z-2 flex flex-col min-h-[22rem] p-[2.4rem] pointer-events-none">
                <h5 className="h5 mb-5">{item.title}</h5>
                <p className="body-2 mb-6 text-n-3">{item.text}</p>
                
                <div className="flex items-center mt-auto">
                  <img
                    src={item.iconUrl}
                    width={48}
                    height={48}
                    alt={item.title}
                  />
                  <p className="ml-auto font-code text-xs font-bold text-n-1 uppercase tracking-wider">
                    Explore more
                  </p>
                  <Arrow />
                </div>
                </div>
                {item.light ? <GradientLight /> : null}
              <div
                className="absolute inset-0.5 bg-n-8"
                style={{ clipPath: "url(#benefits)" }}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity hover:opacity-15 active:opacity-10">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      width={380}
                      height={362}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              <ClipPath />
              </div>)
              
            })}
        </div>
      </div>
    </Section>
  )
}

export default Benefits
