import React from "react";
import {Link} from 'react-router-dom';
/**
 * 
 * Template adapted from https://mdbootstrap.com/docs/standard/navigation/footer/
 */
function Footer({ theme }) {
  return (
    <div className="App">
        <div className="md-4"><hr></hr></div>
        
        <footer class={`text-center text-lg-start text-muted ${theme == 'dark' ? 'bg-dark' : 'bg-light'} `}>

            <section class="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">

            <div class="me-5 d-none d-lg-block">
                <span>Get connected with us on social networks:</span>
            </div>

            <div>
                <Link to="" class="me-4 text-reset">
                <i class="fab fa-facebook-f"></i>
                </Link>
                <Link to="" class="me-4 text-reset">
                <i class="fab fa-twitter"></i>
                </Link>
                <Link to="" class="me-4 text-reset">
                <i class="fab fa-google"></i>
                </Link>
                <Link to="" class="me-4 text-reset">
                <i class="fab fa-instagram"></i>
                </Link>
                <Link to="" class="me-4 text-reset">
                <i class="fab fa-linkedin"></i>
                </Link>
                <Link to="" class="me-4 text-reset">
                <i class="fab fa-github"></i>
                </Link>
            </div>

            </section>

            <section class="">
            <div class="container text-center text-md-start mt-5">

                <div class="row mt-3">
            
                <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">
            
                    <h6 class="text-uppercase fw-bold mb-4">
                    <i class="fas fa-gamepad me-3"></i>ELEARN
                    </h6>
                    <p>
                    Welcome to Elearn, your ultimate online learning destination! Discover best courses, enroll, and find your next career opportunities effortlessly.
                    </p>
                </div>

                <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">

                    <h6 class="text-uppercase fw-bold mb-4">
                    Products
                    </h6>
                    <p>
                    <Link to="/about" class="text-reset">About</Link>
                    </p>
                    <p>
                    <Link to="/contact" class="text-reset">Contact</Link>
                    </p>
                    <p>
                    <Link to="/team" class="text-reset">Team</Link>
                    </p>
                </div>


            
                <div class="col-md-3 col-lg-2 col-xl-2 mx-auto mb-4">

                    <h6 class="text-uppercase fw-bold mb-4">
                    Useful links
                    </h6>
                    <p>

                    <Link to="/privacy" class="text-reset">Privacy</Link>
                    </p>
                    <p>
                    <Link to="/terms" class="text-reset">Terms & Conditions</Link>
                    </p>
                    <p>
                    <Link to="#!" class="text-reset">Forum</Link>
                    </p>
                </div>
            

            
                <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
            
                    <h6 class="text-uppercase fw-bold mb-4">Contact</h6>
                    <p><i class="fas fa-home me-3"></i> Berkhamshier Way, NY SE14, USA</p>
                    <p>
                    <i class="fas fa-envelope me-3"></i>
                    info@gamepulse.com
                    </p>
                    <p><i class="fas fa-phone me-3"></i> + 11 20 7019 7171</p>
                </div>
            
                </div>
            
            </div>
            </section>



            <div class="text-center p-4">
            © Copyright:
            <Link to="/" class="text-reset fw-bold">&nbsp;Elearn</Link>
            </div>

            </footer>
    </div>
  );
}

export default Footer;