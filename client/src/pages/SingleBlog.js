import React from "react";
import Meta from "../components/Meta";
import BreadCrumb from "../components/BreadCrumb";
import { Link } from "react-router-dom";
import { HiOutlineArrowLeft } from "react-icons/hi";
import blog from "../images/blog-1.jpg";
import Container from "../components/Container";

const SingleBlog = () => {
  return (
    <>
      {/* Make Blog title dynamic  */}
      <Meta title={"Dynamic Blog Name"} />
      <BreadCrumb title="Dynamic Blog Name" />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        <div className="row">
          <div className="col-12">
            <div className="single-blog-card">
              <Link to="/blogs" className="d-flex align-items-center gap-10">
                <HiOutlineArrowLeft className="fs-4" /> Go Back to Blogs
              </Link>
              <h3 className="title">A beautiful Sunday Morning Renaissance</h3>
              <img src={blog} className="img-fluid w-100 my-4" alt="blog" />
              <p>
                {" "}
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut,
                dolorum, repellendus odit dignissimos rem nemo consequatur ea
                officia, maxime eius voluptatem. Autem, repudiandae quasi.
                Deleniti porro odio eaque qui consequuntur. Nihil ratione saepe
                odit quaerat. Officia eos accusamus reiciendis nam est minima
                quos rerum magni atque enim, doloremque alias ipsa libero totam
                autem, reprehenderit aspernatur aperiam odio expedita vero
                neque. Consectetur rerum vel voluptas nulla, repellendus odio,
                quibusdam ratione nesciunt fugit dolores, distinctio alias!
                Quasi, provident cumque, eaque obcaecati veritatis ut et,
                praesentium voluptates sint dolorem dicta assumenda nobis
                ducimus.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default SingleBlog;
