import { notificationImages } from "../constants"
import notification1 from "../assets/notification/image-1.png"

const Notification = ({ className, title}) => {
  console.log('notificationImages:', notificationImages);
  return (
    <div className={`${className || ''} flex items-center p-4 pr-6  backdrop-blur border bg-n-9-transparent border-n-1/10 rounded-2xl gap-5`} >
      <img src={notification1} width={62} height={62} alt="image" className="rounded-xl" />

      <div className="flex-1">
        
        <h6 className="mb-1 -ml-2 font-semibold text-base">
          {title}
        </h6>
        <div className="flex items-center justify-between ">
        <ul className="flex -m-0.5">
          {Array.from(notificationImages).map((item, index) => (
            <li key={index} className="flex w-6 h-6 border-2 border-n-12 rounded-full overflow-hidden">
              <img src={item} className="w-full" width={20} height={20} alt={`notification ${index + 1}`} />
            </li>
          ))}
        </ul>

         <div className="body-2 text-n-13">1m ago</div> 
        </div>

      </div>
    </div>
  )
}

export default Notification
