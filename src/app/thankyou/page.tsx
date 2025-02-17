"use client";
import withAuth from "@/hoc/withAuth";

function ThankYou(){
    return(
    <div className="at-thankyouwrapper">
        <div className="at-tahnkyoucontent">
            <div className="at-thankyoucontentholder">
                <a href="javascript:; void(0)" className="at-thankyoulogo">
                    <strong>
                        <img src="images/logoIcon.png" alt="" />
                    </strong>
                </a>
                <figure className="at-thankyouimg">
                    <img src="images/thankyou.svg" alt="" />
                </figure>
                <div className="at-thankyoucontentimg">
                    <p>For Placing your order</p>
                    <figure>
                        <img src="images/tp.png" alt="" />
                    </figure>
                </div>
            </div>
        </div>
    </div>
    )
}

export default withAuth(ThankYou);