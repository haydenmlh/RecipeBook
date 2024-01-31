import { useState } from 'react';
import logo from '../../components/Common/img/easy-chef-logo-only.png';
import WelcomeText from './WelcomeText';
import './style.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SearchOnly from './SearchOnly';

const Search = () => {

  


  return (
    <>
    <div class="d-flex justify-content-center">
      <div class="d-flex flex-column flex-md-row align-items-center justify-content-center">
        <img class="" src={logo} style={{width: "min(50%, 300px)", paddingRight: "35px"}} />
        <div class="w-75">
          <WelcomeText />
          <SearchOnly />
          
        </div>
      </div>
    </div>
    </>
  )

};

export default Search;