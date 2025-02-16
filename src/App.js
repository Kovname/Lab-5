import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './App.css';

const API_URL = 'https://countriesnow.space/api/v0.1';

const fetchCountries = async () => {
  try {
    const response = await fetch(`${API_URL}/countries`);
    const data = await response.json();
    return data.data.map(country => ({
      country: country.country,
      cities: country.cities
    }));
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

const fetchCities = async (country) => {
  try {
    const response = await fetch(`${API_URL}/countries/cities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ country })
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.66667 7.33333V5.33333C4.66667 3.49238 6.15905 2 8 2C9.84095 2 11.3333 3.49238 11.3333 5.33333V7.33333M4.66667 7.33333H11.3333M4.66667 7.33333H3.33333C2.59695 7.33333 2 7.93029 2 8.66667V12.6667C2 13.403 2.59695 14 3.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V8.66667C14 7.93029 13.403 7.33333 12.6667 7.33333H11.3333" 
      stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66667 4.66667L7.05733 7.85867C7.63867 8.28133 8.36133 8.28133 8.94267 7.85867L13.3333 4.66667M3.33333 13.3333H12.6667C13.403 13.3333 14 12.7364 14 12V4C14 3.26362 13.403 2.66667 12.6667 2.66667H3.33333C2.59695 2.66667 2 3.26362 2 4V12C2 12.7364 2.59695 13.3333 3.33333 13.3333Z" 
      stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.66667 3.33333C2.66667 2.59695 3.26362 2 4 2H5.86487C6.1871 2 6.47562 2.19379 6.59487 2.49333L7.79487 5.49333C7.93353 5.84181 7.84593 6.24167 7.57487 6.49333L6.484 7.51467C6.92933 8.5932 7.8068 9.47067 8.88533 9.916L9.90667 8.82513C10.1583 8.55407 10.5582 8.46647 10.9067 8.60513L13.9067 9.80513C14.2062 9.92438 14.4 10.2129 14.4 10.5351V12.4C14.4 13.1364 13.803 13.7333 13.0667 13.7333C7.18819 13.7333 2.66667 9.21181 2.66667 3.33333Z" 
      stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C9.88075 2 11.5816 2.80149 12.7493 4.06653M12.7493 2V4.06653M12.7493 4.06653H10.6667" 
      stroke="#007AFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 8C2 8 4 4 8 4C12 4 14 8 14 8C14 8 12 12 8 12C4 12 2 8 2 8Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const App = () => {
  const { register: registerForm, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = useForm({
    defaultValues: {
      phone: '',
      email: '',
      password: ''
    }
  });

  const { register: profileForm, handleSubmit: handleProfileSubmit, formState: { errors: profileErrors } } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      placeOfBirth: '',
      contactEmail: '',
      contactPhone: '',
      street: '',
      country: '',
      city: '',
      zipCode: '',
      optional: ''
    }
  });

  const [formType, setFormType] = useState('registration');
  const [registrationStep, setRegistrationStep] = useState(1);
  const [profileStep, setProfileStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryCodes, setCountryCodes] = useState([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState('+1');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    registration: {
      phone: '',
      email: '',
      password: ''
    },
    profile: {
      personal: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        placeOfBirth: ''
      },
      contacts: {
        email: '',
        phone: '',
        socials: []
      },
      address: {
        street: '',
        city: '',
        country: '',
        zipCode: '',
        optional: ''
      }
    }
  });

  // Загрузка списка стран при монтировании компонента
  useEffect(() => {
    const loadCountries = async () => {
      const countriesList = await fetchCountries();
      setCountries(countriesList);
    };
    loadCountries();
  }, []);

  // Загрузка городов при выборе страны
  const handleCountryChange = async (country) => {
    setSelectedCountry(country);
    const citiesList = await fetchCities(country);
    setCities(citiesList);
  };

  // Обновляем функцию получения кодов стран
  const fetchCountryCodes = async () => {
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/codes');
      const data = await response.json();
      if (data.data) {
        // Преобразуем данные, убираем название страны и оставляем только код
        const codes = data.data.map(country => ({
          // Убираем лишний плюс, если он есть в dial_code
          code: country.dial_code.startsWith('+') 
            ? country.dial_code 
            : `+${country.dial_code}`
        }));
        // Сортируем коды по возрастанию
        codes.sort((a, b) => {
          const numA = parseInt(a.code.replace('+', ''));
          const numB = parseInt(b.code.replace('+', ''));
          return numA - numB;
        });
        setCountryCodes(codes);
      }
    } catch (error) {
      console.error('Error fetching country codes:', error);
    }
  };

  // Загружаем коды стран при монтировании компонента
  useEffect(() => {
    fetchCountryCodes();
  }, []);

  const onRegisterSubmit = (data) => {
    setFormData(prev => ({
      ...prev,
      registration: {
        phone: `${selectedCountryCode}${phoneNumber}`,
        email: data.email,
        password: data.password
      }
    }));
    setFormType('profile');
    setProfileStep(1);
  };

  const onProfileSubmit = (data) => {
    // Фильтруем социальные сети, убирая пустые
    const socials = [
      { type: data.socialType1, username: data.socialUsername1 },
      { type: data.socialType2, username: data.socialUsername2 }
    ].filter(social => social.type && social.username);

    const updatedFormData = {
      ...formData,
      profile: {
        personal: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          placeOfBirth: data.placeOfBirth
        },
        contacts: {
          email: data.contactEmail || '',
          phone: data.contactPhone || '',
          socials: socials
        },
        address: {
          street: data.street,
          city: data.city,
          country: data.country,
          zipCode: data.zipCode,
          optional: data.optional
        }
      }
    };

    setFormData(updatedFormData);

    if (profileStep === 3) {
      console.log('Complete User Data:', updatedFormData);
    } else {
      setProfileStep(prevStep => prevStep + 1);
    }
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    setRegistrationStep(2);
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (confirmationCode === '1234') { // Проверяем стандартный код
      setRegistrationStep(3);
    }
  };

  const renderRegistrationSteps = () => {
    switch (registrationStep) {
      case 1:
        return (
          <form onSubmit={handlePhoneSubmit}>
            <div className="form-step">
              <div className="privacy-notice">
                <span className="lock-icon"><LockIcon /></span>
                <p>We take privacy issues seriously. You can be sure that your personal data is securely protected.</p>
                <button type="button" className="close-notice">×</button>
              </div>

              <div className="phone-input-group">
                <label>Enter your phone number</label>
                <div className="phone-input">
                  <select 
                    value={selectedCountryCode}
                    onChange={(e) => setSelectedCountryCode(e.target.value)}
                    className="country-code"
                  >
                    {countryCodes.map((country, index) => (
                      <option key={index} value={country.code}>
                        {country.code}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => {
                      // Убираем все нецифровые символы
                      const cleaned = e.target.value.replace(/\D/g, '');
                      // Форматируем номер без жёсткой привязки к формату
                      setPhoneNumber(cleaned);
                    }}
                    placeholder="Enter phone number"
                  />
                </div>
                {phoneNumber && phoneNumber.length < 7 && (
                  <span className="error">Please enter a valid phone number</span>
                )}
              </div>

              <button 
                type="submit" 
                className="send-code-button"
                disabled={phoneNumber.length < 7}
              >
                Send Code
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleCodeSubmit}>
            <div className="form-step">
              <div className="phone-display">
                <span>{phoneNumber}</span>
                <span className="status-text">Number not confirmed yet</span>
                <button type="button" onClick={() => setRegistrationStep(1)} className="edit-button">✎</button>
              </div>

              <div className="confirmation-input">
                <label>Confirmation code</label>
                <input 
                  type="text"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  placeholder="Enter code"
                />
                <p className="hint-text">
                  Confirm phone number with code from sms message
                </p>
                <button type="button" className="resend-button">
                  <span className="refresh-icon"><RefreshIcon /></span>
                  Send again
                </button>
              </div>

              <button type="submit" className="confirm-button">
                Confirm
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
            <div className="form-step">
              <div className="phone-display confirmed">
                <span>{phoneNumber}</span>
                <span className="status-text success">✓ Number confirmed</span>
              </div>

              <div className="input-group">
                <label>Enter your email</label>
                <input 
                  type="email" 
                  {...registerForm('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="alex_manager@gmail.com"
                />
                {registerErrors.email && <span className="error">{registerErrors.email.message}</span>}
              </div>

              <div className="input-group">
                <label>Set a password</label>
                <div className="password-input">
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...registerForm('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                    placeholder="••••••"
                  />
                  <button 
                    type="button" 
                    className="show-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <EyeIcon />
                  </button>
                </div>
                {registerErrors.password && <span className="error">{registerErrors.password.message}</span>}
                <span className="password-strength">✓ Good password</span>
              </div>

              <button type="submit" className="register-button">
                Register Now
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  const renderProfileSteps = () => {
    switch (profileStep) {
      case 1:
        return (
          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <div className="form-step">
              <div className="terms-checkbox">
                <input 
                  type="checkbox" 
                  id="terms"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms">I agree with <span className="terms-link">Terms of use</span></label>
              </div>

              <div className="personal-data">
                <h2>Personal data</h2>
                <p>Specify exactly as in your passport</p>
                
                <div className="input-group">
                  <label>First name</label>
                  <input 
                    type="text" 
                    {...profileForm('firstName', { required: 'First name is required' })}
                    placeholder="Alexander" 
                  />
                  {profileErrors.firstName && <span className="error">{profileErrors.firstName.message}</span>}
                </div>

                <div className="input-group">
                  <label>Second name</label>
                  <input 
                    type="text" 
                    {...profileForm('lastName', { required: 'Last name is required' })}
                    placeholder="Smith" 
                  />
                  {profileErrors.lastName && <span className="error">{profileErrors.lastName.message}</span>}
                </div>

                <div className="date-place-group">
                  <div className="input-group">
                    <label>Date of Birth</label>
                    <input 
                      type="date" 
                      {...profileForm('dateOfBirth', { required: 'Date of birth is required' })}
                    />
                    {profileErrors.dateOfBirth && <span className="error">{profileErrors.dateOfBirth.message}</span>}
                  </div>
                  <div className="input-group">
                    <label>Place of Birth</label>
                    <input 
                      type="text" 
                      {...profileForm('placeOfBirth', { required: 'Place of birth is required' })}
                      placeholder="New York, USA" 
                    />
                    {profileErrors.placeOfBirth && <span className="error">{profileErrors.placeOfBirth.message}</span>}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="next-button"
                disabled={!termsAccepted}
              >
                Go Next
              </button>
            </div>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <div className="form-step">
              <div className="contacts-section">
                <h2>Contacts</h2>
                <p>These contacts we need to inform about orders</p>

                <div className="input-group">
                  <div className="input-with-icon">
                    <span className="input-icon"><EmailIcon /></span>
                    <input 
                      type="email" 
                      {...profileForm('contactEmail', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      placeholder="alex_manager@gmail.com" 
                    />
                  </div>
                  {profileErrors.contactEmail && <span className="error">{profileErrors.contactEmail.message}</span>}
                </div>

                <div className="input-group">
                  <div className="input-with-icon">
                    <span className="input-icon"><PhoneIcon /></span>
                    <input 
                      type="tel" 
                      {...profileForm('contactPhone', { required: 'Phone is required' })}
                      placeholder="+1 555 555-1234" 
                    />
                  </div>
                  {profileErrors.contactPhone && <span className="error">{profileErrors.contactPhone.message}</span>}
                </div>

                <div className="social-network">
                  <h2>Social network</h2>
                  <p>Indicate the desired communication method</p>

                  <div className="social-inputs">
                    <div className="input-group">
                      <div className="input-with-select">
                        <select {...profileForm('socialType1', { required: 'Select social network' })}>
                          <option value="">Select type</option>
                          <option value="Skype">Skype</option>
                          <option value="Telegram">Telegram</option>
                          <option value="WhatsApp">WhatsApp</option>
                        </select>
                        <input 
                          type="text" 
                          {...profileForm('socialUsername1', { required: 'Username is required' })}
                          placeholder="@username" 
                        />
                      </div>
                      {profileErrors.socialType1 && <span className="error">{profileErrors.socialType1.message}</span>}
                      {profileErrors.socialUsername1 && <span className="error">{profileErrors.socialUsername1.message}</span>}
                    </div>

                    <div className="input-group">
                      <div className="input-with-select">
                        <select {...profileForm('socialType2')}>
                          <option value="">Select type</option>
                          <option value="Facebook">Facebook</option>
                          <option value="LinkedIn">LinkedIn</option>
                          <option value="Twitter">Twitter</option>
                        </select>
                        <input 
                          type="text" 
                          {...profileForm('socialUsername2')}
                          placeholder="@profile" 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="next-button">
                Go Next
              </button>
            </div>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleProfileSubmit(onProfileSubmit)}>
            <div className="form-step">
              <div className="delivery-address">
                <h2>Delivery address</h2>
                <p>Used for shipping orders</p>

                <div className="input-group">
                  <label>Address</label>
                  <input 
                    {...profileForm('street', { required: 'Address is required' })}
                    type="text" 
                    placeholder="47 W 13th St" 
                  />
                  {profileErrors.street && <span className="error">{profileErrors.street.message}</span>}
                </div>

                <div className="input-group">
                  <label>Country</label>
                  <select 
                    {...profileForm('country', { required: 'Country is required' })}
                    onChange={(e) => handleCountryChange(e.target.value)}
                  >
                    <option value="">Select country</option>
                    {countries.map((country, index) => (
                      <option key={index} value={country.country}>
                        {country.country}
                      </option>
                    ))}
                  </select>
                  {profileErrors.country && <span className="error">{profileErrors.country.message}</span>}
                </div>

                <div className="input-group">
                  <label>City</label>
                  <select 
                    {...profileForm('city', { required: 'City is required' })}
                    disabled={!selectedCountry}
                  >
                    <option value="">Select city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  {profileErrors.city && <span className="error">{profileErrors.city.message}</span>}
                </div>

                <div className="input-group">
                  <label>Zip code</label>
                  <input 
                    {...profileForm('zipCode', { 
                      required: 'Zip code is required',
                      pattern: {
                        value: /^\d{5}(-\d{4})?$/,
                        message: 'Please enter valid zip code'
                      }
                    })}
                    type="text" 
                    placeholder="10011" 
                  />
                  {profileErrors.zipCode && <span className="error">{profileErrors.zipCode.message}</span>}
                </div>

                <div className="input-group">
                  <label>Optional</label>
                  <input 
                    {...profileForm('optional')}
                    type="text" 
                  />
                </div>
              </div>

              <button type="submit" className="save-button">
                Save
              </button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  const renderContent = () => {
    if (formType === 'registration') {
      return (
        <>
          <h1>Registration</h1>
          <p className="subtitle">
            Fill in the registration data. It will take a couple of minutes.<br />
            All you need is a phone number and e-mail
          </p>
          {renderRegistrationSteps()}
        </>
      );
    } else {
      return (
        <>
          <h1>Profile info</h1>
          <p className="subtitle">
            Fill in the data for profile. It will take a couple of minutes.<br />
            You only need a passport
          </p>
          {renderProfileSteps()}
        </>
      );
    }
  };

  const styles = `
    .next-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `;

  return (
    <div className="app-container">
      <div className="header">
        <div className="company-logo">
          <span className="logo">PH</span>
          <span className="company-name">PonosHub</span>
        </div>
        <button className="close-button">×</button>
      </div>

      <div className="form-container">
        <div className="progress-dots">
          <div className="progress-line">
            {formType === 'registration' ? (
              <>
                <div className={`dot ${registrationStep >= 1 ? 'active' : ''}`}></div>
                <div className={`dot-line ${registrationStep >= 2 ? 'active' : ''}`}></div>
                <div className={`dot ${registrationStep >= 2 ? 'active' : ''}`}></div>
                <div className={`dot-line ${registrationStep >= 3 ? 'active' : ''}`}></div>
                <div className={`dot ${registrationStep >= 3 ? 'active' : ''}`}></div>
              </>
            ) : (
              <>
                <div className={`dot ${profileStep >= 1 ? 'active' : ''}`}></div>
                <div className={`dot-line ${profileStep >= 2 ? 'active' : ''}`}></div>
                <div className={`dot ${profileStep >= 2 ? 'active' : ''}`}></div>
                <div className={`dot-line ${profileStep >= 3 ? 'active' : ''}`}></div>
                <div className={`dot ${profileStep >= 3 ? 'active' : ''}`}></div>
              </>
            )}
          </div>
        </div>

        <div className="form-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;