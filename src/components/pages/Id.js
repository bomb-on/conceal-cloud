import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../ContextProvider';
import IdCard from '../elements/IdCard';
import IdForm from '../elements/IdForm';
import Accordion from 'react-bootstrap/Accordion';


const Id = () => {
  const { state } = useContext(AppContext);
  const { id, layout } = state;
  const { message } = layout;

  const [showForm, setShowForm] = useState(false);

  return (
    <div>
      <div className="slim-mainpanel">
        <div className="container">

          <div className="slim-pageheader">
            <ol className="breadcrumb slim-breadcrumb">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item active" aria-current="page">ID</li>
            </ol>
            <h6 className="slim-pagetitle">ID</h6>
          </div>

          <div className="section-wrapper mg-t-20">
            <div className="d-flex flex-row width-100 justify-content-between mg-b-10">
              <label className="section-title d-inline-block">Your Conceal IDs</label>
              <div>
                {layout.idLoaded && id.length > 0 &&
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowForm(!showForm)}
                  >
                    {showForm ? 'CANCEL' : 'CREATE ID'}
                  </button>
                }
              </div>
            </div>

            <div>
              {message.idForm &&
                <div className="alert alert-outline alert-danger text-center">{message.idForm}</div>
              }
            </div>

            {showForm && <IdForm/>}

            <div className="row">
              <div className="col-lg-12">
                {layout.idLoaded && id.length === 0
                  ? (!showForm
                      ? <>
                          <div className="mg-b-15">
                            You have no ID set up yet. Create your first ID by filling up the form below.
                          </div>
                          <IdForm/>
                        </>
                      : <></>
                    )
                  : <Accordion>
                      {id.map(i => <IdCard key={i.address} id={i}/>)}
                    </Accordion>
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Id;
