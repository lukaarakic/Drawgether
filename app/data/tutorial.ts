import Hearts from "~/assets/misc/hearts.svg"
import Stars from "~/assets/misc/stars.svg"
import Marks from "~/assets/misc/marks.svg"

export const rules = [
  {
    type: Hearts,
    rule: "Keep it family friendly!",
    style: {
      top: 0,
      left: "-67rem",
      rotate: "5.75deg",
      animationDelay: "0s",
    },
  },
  {
    type: Stars,
    rule: "Stay positive!",
    style: {
      top: "10rem",
      left: "-15rem",
      rotate: "-4.56deg",
      animationDelay: ".5s",
    },
  },
  {
    type: Marks,
    rule: "BE CREATIVE!",
    style: {
      top: 0,
      right: "-69rem",
      animationDelay: "1s",
    },
  },
]

export const howTo = [
  {
    text: "Join a lobby with 1-4 friends",
    style: {
      rotate: "-6.26deg",
    },
  },
  {
    text: "Host will start the game",
    style: {
      rotate: "5.45deg",
    },
  },
  {
    text: "Get the theme",
    style: {
      rotate: "-13.54deg",
    },
  },
  {
    text: "Start drawing!",
    style: {
      rotate: "8.29deg",
    },
  },
]
