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
  },
  {
    text: "Host will start the game",
  },
  {
    text: "Get the theme",
  },
  {
    text: "Start drawing!",
  },
]
