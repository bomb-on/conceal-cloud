import React, { useContext, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import HCaptcha from '@hcaptcha/react-hcaptcha';

import { AppContext } from '../ContextProvider';
import { useFormInput, useFormValidation, useMountEffect } from '../../helpers/hooks';


const ResetPassword = () => {
  const navigate = useNavigate();
  const params = useParams();
  const token = params.token?.match(/^[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/) ? params.token : null;
  const { actions, state } = useContext(AppContext);
  const { resetPassword, resetPasswordConfirm } = actions;
  const { appSettings, layout, user, userSettings } = state;
  const { formSubmitted, message } = layout;
  const captchaRef = useRef(null);

  useMountEffect(() => {
    if (user.loggedIn()) navigate('/dashboard');
  });

  const { value: email, bind: bindEmail } = useFormInput('');
  const { value: password, bind: bindPassword } = useFormInput('');
  const { value: passwordConfirm, bind: bindPasswordConfirm } = useFormInput('');
  const [captchaToken, setCaptchaToken] = useState(null);

  const formValidation = (
    token
      ? password !== '' && password.length >= userSettings.minimumPasswordLength &&
        passwordConfirm !== '' && passwordConfirm.length >= userSettings.minimumPasswordLength &&
        password === passwordConfirm
      : email !== '' && email.length >= 3 && email.includes('@')
  );
  const formValid = useFormValidation(formValidation);

  return (
    <div className="signin-wrapper">

      <div className="signin-box">
        <h2 className="slim-logo"><a href="/">Conceal Cloud</a></h2>
        <h3 className="signin-title-secondary">Reset Password</h3>

        {message.resetPasswordForm &&
          <div className="alert alert-outline alert-danger text-center">{message.resetPasswordForm}</div>
        }

        {token
          ? <form
              onSubmit={e => {
                if (!captchaToken) {
                  e.preventDefault();
                  captchaRef.current.execute();
                } else {
                  resetPasswordConfirm({
                    e,
                    captchaToken,
                    password,
                    token: token,
                    id: 'resetPasswordConfirmForm',
                  })
                }
              }}
            >
              <div className="form-group">
                <input
                  {...bindPassword}
                  placeholder="New Password"
                  type="password"
                  name="password"
                  className="form-control"
                  minLength={8}
                />
              </div>
              <div className="form-group mg-b-50">
                <input
                  {...bindPasswordConfirm}
                  placeholder="Confirm New Password"
                  type="password"
                  name="passwordConfirm"
                  className="form-control"
                  minLength={8}
                />
              </div>
              <div className="text-center mg-b-50">
                <HCaptcha
                  sitekey={appSettings.hCaptchaSiteKey}
                  onVerify={setCaptchaToken}
                  ref={captchaRef}
                />
              </div>

              {message.resetPasswordConfirmForm &&
                <div className="text-danger text-center">{message.resetPasswordConfirmForm}</div>
              }

              <button
                type="submit"
                disabled={formSubmitted || !formValid}
                className="btn btn-primary btn-block btn-signin"
              >
                {formSubmitted ? 'Please wait...' : 'Submit'}
              </button>
            </form>
          : <form
              onSubmit={e => {
                if (!captchaToken) {
                  e.preventDefault();
                  captchaRef.current.execute();
                } else {
                  resetPassword({ captchaToken, e, email, id: 'resetPasswordForm' })
                }
              }}
            >
              <div className="form-group">
                <input
                  {...bindEmail}
                  placeholder="Enter your email"
                  type="email"
                  name="email"
                  className="form-control"
                  minLength={3}
                />
              </div>
              <div className="text-center mg-b-50">
                <HCaptcha
                  sitekey={appSettings.hCaptchaSiteKey}
                  onVerify={setCaptchaToken}
                  ref={captchaRef}
                />
              </div>

              <button
                type="submit"
                disabled={formSubmitted || !formValid}
                className="btn btn-primary btn-block btn-signin"
              >
                {formSubmitted ? 'Please wait...' : 'Submit'}
              </button>
            </form>
        }

        <p className="mg-b-0">Don't have an account? <Link to="/signup">Sign Up</Link></p>
        <p className="mg-b-0">Already have an account? <Link to="/login">Sign In</Link></p>
        <hr />
        <p className="mg-b-0 box-footer">
          Copyright 2019 &copy; All Rights Reserved. Conceal Network<br /><Link to="/terms">Terms &amp; Conditions</Link>
        </p>
      </div>
      ​
    </div>
  )
};

export default ResetPassword;
