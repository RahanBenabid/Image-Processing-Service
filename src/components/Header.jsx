import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { disablePageScroll, enablePageScroll } from 'scroll-lock';
import { useAuth } from '../context/AuthContext';

import jpegHell from '../assets/jpegHell.png';
import { navigation } from '../constants';
import MenuSvg from '../assets/svg/MenuSvg';
import Button from './Button';
import { HamburgerMenu } from './design/Header';
import MegaMenu from './MegaMenu';

const Header = () => {
  const path = useLocation();
  const hash = path.hash;
  const { verifyToken } = useAuth();

  const isValidToken = verifyToken();

  const [showMenu, setShowMegaMenu] = useState(false);
  const [openNavigation, setOpenNavigation] = useState(false);
  const menuContainerRef = useRef(null);

  const handleMenuOn = () => {
    setShowMegaMenu(true);
  };

  const handleMouseOff = () => {
    setShowMegaMenu(false);
  };

  const toggleNav = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll();
    } else {
      setOpenNavigation(true);
      disablePageScroll();
    }
  };

  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll();
    setOpenNavigation(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8 opacity-90 lg:backdrop-blur-sm m-0 p-0">
      <div className="relative flex p-3 items-center justify-between px-5 lg:px-7.5 xl:px-10 bg-n-8 max-lg:py-4 font-semibold">
        <Link to="/" className="block w-[12rem] xl:mr-8 my-auto">
          <img
            src={jpegHell}
            alt="logo"
            width={190}
            height={100}
            className="m-0"
          />
        </Link>

        <div className="flex items-center space-x-8">
          {!isValidToken && (
            <div
              ref={menuContainerRef}
              className="relative"
              onMouseEnter={handleMenuOn}
              onMouseLeave={handleMouseOff}
            >
              <a
                href="#services"
                className={`hidden transition-colors hover:text-color-1 lg:flex lg:items-center ${
                  hash === '#services'
                    ? 'z-2 text-n-1 lg:text-n-1'
                    : 'text-n-1 lg:text-n-1 opacity-50'
                }`}
              >
                Services
              </a>
              {showMenu && (
                <MegaMenu onMouseEnter={handleMenuOn} onMouseLeave={handleMouseOff} />
              )}
            </div>
          )}

          {isValidToken ? (
            <>
              <Link
                to="/dashboard"
                className="hidden text-n-1 opacity-50 transition-colors hover:text-color-1 lg:flex lg:items-center"
              >
                Dashboard
              </Link>
              <div className="hidden lg:block">
                <Button className="hover:text-color-1">
                  <Link to="/profile">Profile</Link>
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="hidden text-n-1 opacity-50 transition-colors hover:text-color-1 lg:flex lg:items-center"
              >
                New Account
              </Link>

              <div className="hidden lg:block">
                <Button className="hover:text-color-1">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </>
          )}
        </div>

        <Button className="ml-auto lg:hidden" px="px-3" onClick={toggleNav}>
          <MenuSvg openNavigation={openNavigation} />
        </Button>

        <div
          className={`fixed top-0 left-0 w-full z-50 border-b border-n-6 lg:bg-n-8 opacity-90 lg:backdrop-blur-sm ${
            openNavigation ? 'bg-n-8' : 'hidden'
          } lg:hidden`}
        >
          <nav
            className={`${
              openNavigation ? 'flex' : 'hidden'
            } fixed top-[5rem] left-0 right-0 bottom-0 bg-n-8 max-lg:flex`}
          >
            <div className="relative z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => {
                if ((!item.logged && !isValidToken) || (item.logged && isValidToken)) {
                  return (
                    <Link  
                      key={item.id}  
                      to={item.url}   
                      onClick={handleClick}  
                      className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold ${  
                        item.url === hash  
                          ? 'z-2 lg:text-n-1'  
                          : 'lg:text-n-1 opacity-80'  
                      } lg:leading-5 lg:hover:text-n-1 xl:px-12`}  
                    >  
                      {item.title}  
                    </Link>  
                  );
                }
                return null;
              })}
              
              {isValidToken ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={handleClick}
                    className={`block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:text-n-1 opacity-80 lg:leading-5 lg:hover:text-n-1 xl:px-12  ${path.pathname === '/dashboard'
                      ? 'z-2 text-n-1 lg:text-n-1'  
                      : 'text-n-1 lg:text-n-1 opacity-50'}`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={handleClick}
                    className="block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:text-n-1 opacity-80 lg:leading-5 lg:hover:text-n-1 xl:px-12"
                  >
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    onClick={handleClick}
                    className="block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:text-n-1 opacity-80 lg:leading-5 lg:hover:text-n-1 xl:px-12"
                  >
                    New Account
                  </Link>
                  <Link
                    to="/login"
                    onClick={handleClick}
                    className="block relative font-code text-2xl uppercase text-n-1 transition-colors hover:text-color-1 px-6 py-6 md:py-8 lg:-mr-0.25 lg:text-xs lg:font-semibold lg:text-n-1 opacity-80 lg:leading-5 lg:hover:text-n-1 xl:px-12"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
            <HamburgerMenu />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;