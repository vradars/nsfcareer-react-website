import React from 'react';
import Section0 from './IRBcontent/Section0';
import Section1 from './IRBcontent/Section1';
import Section2 from './IRBcontent/Section2';
import Section3 from './IRBcontent/Section3';
import Section4 from './IRBcontent/Section4';
import Section5 from './IRBcontent/Section5';
import Section6 from './IRBcontent/Section6';
import Section7 from './IRBcontent/Section7';
import Section8 from './IRBcontent/Section8';
import Section9 from './IRBcontent/Section9';
import Section10 from './IRBcontent/Section10';
import Section11 from './IRBcontent/Section11';
import Section12 from './IRBcontent/Section12';
import Section13 from './IRBcontent/Section13';
import Section14 from './IRBcontent/Section14';
import Section15 from './IRBcontent/Section15';
import Section16 from './IRBcontent/Section16';
import Section17 from './IRBcontent/Section17';
import Section18 from './IRBcontent/Section18';
import Section19 from './IRBcontent/Section19';
import Section20 from './IRBcontent/Section20';
import Section21 from './IRBcontent/Section21';
import Section22 from './IRBcontent/Section22';
import { getStatusOfDarkmode } from '../reducer';
import SignatureCanvas from 'react-signature-canvas'
import Footer from './Footer';


class IRBLinkContent extends React.Component {
  componentDidMount() {
    if (getStatusOfDarkmode().status === true) {
      document.getElementsByTagName('body')[0].style.background = '#171b25';
    } else {
      const element = document.getElementsByClassName('Collapsible__contentInner');
      for (let i = 0; i < element.length; i++){
        element[i].style.background = "#fff";
        element[i].style.color = "#000";

      }
    }
  }
  render() {
    return (
      <React.Fragment>
        <div style={{ justifyContent: "center", alignItems: "center", gridTemplateColumns: "1fr auto", marginTop: "15vh"}} className="container">
            <div className="row">

                <div  className="col-md-6 col-sm-12">
                    <h2 ref="h1">Institutional Review Board Consent Process (IRB)</h2>
                    <p style={{ color : "#848484", fontWeight: "400", fontSize : "1.6rem"}}>IRB Introducation here ... </p>
                </div>
                <div style={{marginBottom : "1rem"}} className="col-md-6 col-sm-12">
                    <iframe width="100%" height="400px"
                        src="https://www.youtube.com/embed/i4HFc1NLFjo?autoplay=1">
                    </iframe>
                </div>
                <div className="col-md-12 col-sm-12">
                    <div className="collapsible-text">
                      <Section0 />
                      <Section1 />
                      <Section2 />
                      <Section3 />
                      <Section4 />
                      <Section5 />
                      <Section6 />
                      <Section7 />
                      <Section8 />
                      <Section9 />
                      <Section10 />
                      <Section11 />
                      <Section12 />
                      <Section13 />
                      <Section14 />
                      <Section15 />
                      <Section16 />
                      <Section17 />
                      <Section18 />
                      <Section19 />
                      <Section20 />
                      <Section21 />
                      <Section22 />
                    </div>
                </div>
                <div style={{marginTop : "1rem" }} className="col-md-6 col-sm-12">
                    <h3>Your signature here </h3>
                    <SignatureCanvas penColor='black'
    canvasProps={{width: 300, height: 100, className: 'sigCanvas'}} />
<div><button
  type="button"
  onClick={(e)=>{window.location.href="/Login"}}
  style={{
      width: "100%",
    background: "-webkit-linear-gradient(45deg, #174f86, #2196f3)",
    background: "-o-linear-gradient(45deg, #174f86, #2196f3)",
    background: "linear-gradient(45deg, #174f86, #2196f3)",
    lineHeight: "50px",
    textAlign: "left",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "900",
    webkitBoxShadow: "0 0 10px -1px rgba(0, 0, 0, 0.1)",
    boxShadow: "0 0 10px -1px rgba(0, 0, 0, 0.1)",
    border: "1px solid #fff",
    position: "relative",
    cursor: "pointer",
    paddingLeft: "20px"
  }}
>Submit</button></div>

            </div>

            </div>



        </div>
        <Footer />
      </React.Fragment>
    );
  }
}

export default IRBLinkContent;