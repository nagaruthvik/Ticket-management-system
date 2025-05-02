import React from 'react'
import styles from "./HomePage.module.css"
import NavBarComponent from '../Components/NavBarComponent'

export default function HomePage() {
  return (
    <div className={styles.homePageCont}>
        <NavBarComponent/>
    </div>
  )
}
