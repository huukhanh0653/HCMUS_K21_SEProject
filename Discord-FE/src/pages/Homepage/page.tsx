"use client"

import { useState } from "react"
import Home from "@/home"
import Profile from "@/profile"

export default function Page() {
  const [showProfile, setShowProfile] = useState(false)

  const toggleProfile = () => {
    setShowProfile(!showProfile)
  }

  return (
    <div className="w-screen h-screen overflow-hidden">
      <Home onProfileClick={toggleProfile} />
      {showProfile && <Profile onClose={() => setShowProfile(false)} />}
    </div>
  )
}

