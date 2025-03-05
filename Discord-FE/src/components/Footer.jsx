import React from 'react'
import { Link } from 'react-router-dom'
import FOOTER_LINKS from "../assets/footer_links"
import FOOTER_CONTACT_INFO from "../assets/footer_contact"
import SOCIALS from "../assets/socials"
import { useTheme } from './ThemeProvider'
import { FaMoon, FaSun, FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "../pages/Authentication/Authentication.css"

const Footer = () => {
  const socialIcons = [
    { icon: FaFacebook, url: "/" },
    { icon: FaTwitter, url: "/" },
    { icon: FaInstagram, url: "/" },
  ];
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-6 ">
      <footer className='flexCenter pb-24 pt-20'>
        <div className='max_padd_container flex w-full flex-col gap-14'>
          <div className='flex flex-col items-start justify-center gap-[10%] md:flex-row'>
            <div className='flex flex-wrap gap-8 sm:justify-between md:flex-1'>
              {FOOTER_LINKS.map((col) => (
                <FooterColumn 
                  title={<h3 className={`${isDarkMode ? "text-white" : "text-black"}`}>{col.title}</h3>} 
                  key={col.title}
                >
                  <ul className='flex flex-col gap-4 regular-14 text-gray-20'>
                    {col.links.map((link) => (
                      <Link to="/" key={link}> {link} </Link>
                    ))}
                  </ul>
                </FooterColumn>
              ))}
              <div className='flex flex-col gap-5'>
                <FooterColumn title= {<h3 className={`${isDarkMode ? "text-white" : "text-black"}`}>{FOOTER_CONTACT_INFO.title}</h3>}>
                  {FOOTER_CONTACT_INFO.links.map((link) => (
                    <Link to="/" key={link.label} className='flex gap-4 md:flex-col lg:flex-row'>
                      <p>{link.label}:</p><p className='medium-14'>{link.value}</p>
                    </Link>
                  ))}
                </FooterColumn>
              </div>
              <div className='flex'>
                <FooterColumn>
                  <ul className='flex gap-4'>
                  {socialIcons.map(({ icon: Icon, url }, index) => (
                    <Link to={url} key={index}>
                      <Icon size={22} color={isDarkMode ? "white" : "black"} />
                    </Link>
                  ))}
                  </ul>
                </FooterColumn>
              </div>
            </div>
          </div>
          <div className='border bg-gray-20'></div>
          <p className={`text-center ${isDarkMode ?"text-white" :"text-black"}`}> 
            2025 EchoNet| All rights reserved. 
          </p>
        </div>
      </footer>
    </main>
  )
}

const FooterColumn = ({ title, children }) => {
  return (
    <div className='flex flex-col gap-5'>
      <h4 className='bold-18 whitespace-nowrap'> {title} </h4>
      {children}
    </div>
  )
}

export default Footer