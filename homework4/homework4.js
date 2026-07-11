/*
Name: Taha Asmat
File: homework4.js
Date created: July 11th
Last edited: July 11th
Version: 1.0
Description: External JS for Houston Emergency Care HW4
*/

function formatMoney(value) {
  return '$' + Number(value).toFixed(0);
}

const healthLevel = document.getElementById('healthLevel');
const healthLevelValue = document.getElementById('healthLevelValue');
healthLevel.addEventListener('input', function () {
  healthLevelValue.textContent = this.value;
});

const salaryInput = document.getElementById('salary');
const salaryDisplay = document.getElementById('salaryDisplay');
salaryInput.addEventListener('input', function () {
  salaryDisplay.textContent = formatMoney(this.value);
});

const homeMin = document.getElementById('homeMin');
const homeMax = document.getElementById('homeMax');
const homeDisplay = document.getElementById('homePriceDisplay');

function updateHomeRange() {
  const minVal = Number(homeMin.value);
  const maxVal = Number(homeMax.value);
  let text = formatMoney(minVal) + ' - ' + formatMoney(maxVal);
  if (minVal > maxVal) {
    text += ' (Note: min is greater than max!)';
  }
  homeDisplay.textContent = text;
}

homeMin.addEventListener('input', updateHomeRange);
homeMax.addEventListener('input', updateHomeRange);
updateHomeRange();

function getDobDate() {
  const month = parseInt(document.getElementById('dobMonth').value, 10);
  const day = parseInt(document.getElementById('dobDay').value, 10);
  const year = parseInt(document.getElementById('dobYear').value, 10);
  const dateObj = new Date(year, month - 1, day);
  if (dateObj.getFullYear() !== year || dateObj.getMonth() !== month - 1 || dateObj.getDate() !== day) {
    return null;
  }
  return dateObj;
}

let errorCount = 0;

function formatSSN(el) {
  let digits = el.value.replace(/\D/g, '');
  if (digits.length > 9) {
    digits = digits.slice(0, 9);
  }
  let formatted = digits;
  if (digits.length > 5) {
    formatted = digits.slice(0, 3) + '-' + digits.slice(3, 5) + '-' + digits.slice(5);
  } else if (digits.length > 3) {
    formatted = digits.slice(0, 3) + '-' + digits.slice(3);
  }
  el.value = formatted;
}

/* ----- Cookie helper functions ----- */

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(cname) === 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

/* ----- Greeting logic based on cookie ----- */

function updateGreeting() {
  const greeting = document.getElementById('greeting');
  const notYouContainer = document.getElementById('notYouContainer');
  const savedName = getCookie('firstName');

  notYouContainer.innerHTML = '';

  if (savedName) {
    greeting.textContent = 'Welcome back, ' + savedName + '.';
    const fnameInput = document.getElementById('fname');
    if (!fnameInput.value) {
      fnameInput.value = savedName;
    }
    notYouContainer.innerHTML = '<label><input type="checkbox" id="notYouCheck"> Not ' + savedName + '? Click here to start as a NEW USER.</label>';

    document.getElementById('notYouCheck').addEventListener('change', function () {
      if (this.checked) {
        deleteCookie('firstName');
        document.getElementById('regForm').reset();
        greeting.textContent = 'Welcome, new user.';
        notYouContainer.innerHTML = '';
      }
    });
  } else {
    greeting.textContent = 'Welcome, new user.';
  }
}

document.getElementById('rememberMe').addEventListener('change', function () {
  if (!this.checked) {
    deleteCookie('firstName');
  }
});

window.addEventListener('load', updateGreeting);

function validateFname() {
  const v = document.getElementById('fname').value;
  const re = /^[A-Za-z'-]{1,30}$/;
  if (!v) {
    document.getElementById('fnameError').innerHTML = 'First name is required.';
    return false;
  }
  if (!re.test(v)) {
    document.getElementById('fnameError').innerHTML = '1-30 letters, apostrophes, and dashes only.';
    return false;
  }
  document.getElementById('fnameError').innerHTML = '';
  return true;
}

function validateMiddle() {
  const v = document.getElementById('middle').value;
  if (!v) {
    document.getElementById('middleError').innerHTML = '';
    return true;
  }
  if (!/^[A-Za-z]$/.test(v)) {
    document.getElementById('middleError').innerHTML = 'One letter only.';
    return false;
  }
  document.getElementById('middleError').innerHTML = '';
  return true;
}

function validateLname() {
  const v = document.getElementById('lname').value;
  const re = /^[A-Za-z'2-5-]{1,30}$/;
  if (!v) {
    document.getElementById('lnameError').innerHTML = 'Last name is required.';
    return false;
  }
  if (!re.test(v)) {
    document.getElementById('lnameError').innerHTML = '1-30 letters, apostrophes, dashes, and digits 2-5 only.';
    return false;
  }
  document.getElementById('lnameError').innerHTML = '';
  return true;
}

function validateSSN() {
  const v = document.getElementById('ssn').value;
  const digits = v.replace(/\D/g, '');
  if (!digits) {
    document.getElementById('ssnError').innerHTML = 'SSN is required.';
    return false;
  }
  if (digits.length !== 9) {
    document.getElementById('ssnError').innerHTML = 'Must be exactly 9 digits.';
    return false;
  }
  document.getElementById('ssnError').innerHTML = '';
  return true;
}

function validateDOB() {
  const dobDate = getDobDate();
  if (!dobDate) {
    document.getElementById('dobError').innerHTML = 'Enter a real month, day, and year.';
    return false;
  }
  const today = new Date();
  if (dobDate > today) {
    document.getElementById('dobError').innerHTML = "Date of Birth can't be in the future.";
    return false;
  }
  const oldestAllowed = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
  if (dobDate < oldestAllowed) {
    document.getElementById('dobError').innerHTML = 'Cannot be more than 120 years ago.';
    return false;
  }
  const mm = dobDate.getMonth() + 1;
  const dd = dobDate.getDate();
  const mmStr = mm < 10 ? '0' + mm : '' + mm;
  const ddStr = dd < 10 ? '0' + dd : '' + dd;
  document.getElementById('dob').value = mmStr + '/' + ddStr + '/' + dobDate.getFullYear();
  document.getElementById('dobError').innerHTML = '';
  return true;
}

function validateGender() {
  const genderInputs = document.getElementsByName('gender');
  let selected = false;
  for (let i = 0; i < genderInputs.length; i++) {
    if (genderInputs[i].checked) {
      selected = true;
    }
  }
  if (!selected) {
    document.getElementById('genderError').innerHTML = 'Please select a gender.';
    return false;
  }
  document.getElementById('genderError').innerHTML = '';
  return true;
}

function validatePhone() {
  const v = document.getElementById('phone').value;
  const re = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!v) {
    document.getElementById('phoneError').innerHTML = 'Phone number is required.';
    return false;
  }
  if (!re.test(v)) {
    document.getElementById('phoneError').innerHTML = 'Format: 000-000-0000';
    return false;
  }
  document.getElementById('phoneError').innerHTML = '';
  return true;
}

function validateEmail() {
  const el = document.getElementById('email');
  let v = el.value;
  if (!v) {
    document.getElementById('emailError').innerHTML = 'Email is required.';
    return false;
  }
  v = v.toLowerCase();
  el.value = v;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(v)) {
    document.getElementById('emailError').innerHTML = 'Format: name@domain.tld';
    return false;
  }
  document.getElementById('emailError').innerHTML = '';
  return true;
}

function validateAddress() {
  const v = document.getElementById('address').value;
  if (!v) {
    document.getElementById('addressError').innerHTML = 'Address Line 1 is required.';
    return false;
  }
  if (v.length < 2 || v.length > 30) {
    document.getElementById('addressError').innerHTML = '2-30 characters required.';
    return false;
  }
  document.getElementById('addressError').innerHTML = '';
  return true;
}

function validateCity() {
  const v = document.getElementById('city').value;
  const re = /^[A-Za-z\s-]{2,30}$/;
  if (!v) {
    document.getElementById('cityError').innerHTML = 'City is required.';
    return false;
  }
  if (!re.test(v)) {
    document.getElementById('cityError').innerHTML = '2-30 letters, spaces, or dashes.';
    return false;
  }
  document.getElementById('cityError').innerHTML = '';
  return true;
}

function validateState() {
  const v = document.getElementById('state').value;
  if (!v) {
    document.getElementById('stateError').innerHTML = 'Please select a state.';
    return false;
  }
  document.getElementById('stateError').innerHTML = '';
  return true;
}

function validateZip() {
  const v = document.getElementById('zip').value;
  const re = /^[0-9]{5}(-[0-9]{4})?$/;
  if (!v) {
    document.getElementById('zipError').innerHTML = 'Zip code is required.';
    return false;
  }
  if (!re.test(v)) {
    document.getElementById('zipError').innerHTML = '5 digits, or ZIP+4 as 00000-0000.';
    return false;
  }
  document.getElementById('zipError').innerHTML = '';
  return true;
}

function validateSymptoms() {
  const v = document.getElementById('symptoms').value;
  if (v.indexOf('"') !== -1) {
    document.getElementById('symptomsError').innerHTML = 'No double quotes allowed.';
    return false;
  }
  document.getElementById('symptomsError').innerHTML = '';
  return true;
}

function validateConditions() {
  const checked = document.querySelectorAll('input[name="conditions"]:checked');
  if (checked.length === 0) {
    document.getElementById('conditionsError').innerHTML = 'Select at least one condition.';
    return false;
  }
  document.getElementById('conditionsError').innerHTML = '';
  return true;
}

function validateVaccinated() {
  const checked = document.querySelector('input[name="vaccinated"]:checked');
  if (!checked) {
    document.getElementById('vaccinatedError').innerHTML = 'Please select vaccination status.';
    return false;
  }
  document.getElementById('vaccinatedError').innerHTML = '';
  return true;
}

function validateInsurance() {
  const checked = document.querySelector('input[name="insurance_radio"]:checked');
  if (!checked) {
    document.getElementById('insuranceError').innerHTML = 'Please select insurance status.';
    return false;
  }
  document.getElementById('insuranceError').innerHTML = '';
  return true;
}

function validateUserid() {
  const v = document.getElementById('userid').value;
  const re = /^[A-Za-z][A-Za-z0-9_-]{4,29}$/;
  if (!v) {
    document.getElementById('useridError').innerHTML = 'User ID is required.';
    return false;
  }
  if (!re.test(v)) {
    document.getElementById('useridError').innerHTML = '5-30 characters, must start with a letter. Letters, numbers, dash, underscore only.';
    return false;
  }
  document.getElementById('useridError').innerHTML = '';
  return true;
}

function validatePassword() {
  const pword = document.getElementById('pword').value;
  const pword2 = document.getElementById('pword2').value;
  const userid = document.getElementById('userid').value;
  const fname = document.getElementById('fname').value;
  const lname = document.getElementById('lname').value;
  const re = /(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,30}/;

  if (!pword) {
    document.getElementById('pwordError').innerHTML = 'Password is required.';
    return false;
  }
  if (pword.indexOf('"') !== -1 || pword.indexOf("'") !== -1) {
    document.getElementById('pwordError').innerHTML = 'No quote characters allowed.';
    return false;
  }
  if (!re.test(pword)) {
    document.getElementById('pwordError').innerHTML = '8-30 characters: at least 1 uppercase, 1 number, and 1 special character.';
    return false;
  }
  if (userid && pword.toLowerCase().indexOf(userid.toLowerCase()) !== -1) {
    document.getElementById('pwordError').innerHTML = "Password can't contain your User ID.";
    return false;
  }
  if ((fname && pword.toLowerCase().indexOf(fname.toLowerCase()) !== -1) ||
      (lname && pword.toLowerCase().indexOf(lname.toLowerCase()) !== -1)) {
    document.getElementById('pwordError').innerHTML = "Password can't contain your name.";
    return false;
  }
  document.getElementById('pwordError').innerHTML = '';

  if (!pword2) {
    document.getElementById('pword2Error').innerHTML = 'Please re-enter the password.';
    return false;
  }
  if (pword !== pword2) {
    document.getElementById('pword2Error').innerHTML = "Passwords don't match.";
    return false;
  }
  document.getElementById('pword2Error').innerHTML = '';
  return true;
}

function validateAll() {
  errorCount = 0;

  if (!validateFname()) errorCount++;
  if (!validateMiddle()) errorCount++;
  if (!validateLname()) errorCount++;
  if (!validateSSN()) errorCount++;
  if (!validateDOB()) errorCount++;
  if (!validateGender()) errorCount++;
  if (!validatePhone()) errorCount++;
  if (!validateEmail()) errorCount++;
  if (!validateAddress()) errorCount++;
  if (!validateCity()) errorCount++;
  if (!validateState()) errorCount++;
  if (!validateZip()) errorCount++;
  if (!validateSymptoms()) errorCount++;
  if (!validateConditions()) errorCount++;
  if (!validateVaccinated()) errorCount++;
  if (!validateInsurance()) errorCount++;
  if (!validateUserid()) errorCount++;
  if (!validatePassword()) errorCount++;

  if (errorCount === 0) {
    document.getElementById('submitBtn').disabled = false;

    const rememberMe = document.getElementById('rememberMe');
    if (rememberMe.checked) {
      const fname = document.getElementById('fname').value;
      if (fname) {
        setCookie('firstName', fname, 2);
      }
    } else {
      deleteCookie('firstName');
    }
    updateGreeting();

    alert('All data looks good. You may now submit the form.');
  } else {
    document.getElementById('submitBtn').disabled = true;
    alert('Please fix the highlighted errors before submitting.');
  }
}

function resetErrors() {
  const errorSpans = document.querySelectorAll('.error');
  for (let i = 0; i < errorSpans.length; i++) {
    errorSpans[i].innerHTML = '';
  }
  document.getElementById('submitBtn').disabled = true;
}

document.getElementById('submitBtn').disabled = true;

function buildReview() {
  const f = document.regForm;

  const fname = f.fname.value;
  const middle = f.middle.value;
  const lname = f.lname.value;
  const dobDate = getDobDate();
  const dobText = dobDate
    ? (dobDate.getMonth() + 1) + '/' + dobDate.getDate() + '/' + dobDate.getFullYear()
    : '(incomplete)';
  const dobStatus = dobDate ? 'pass' : 'ERROR: invalid date';

  const email = f.email.value;
  const phone = f.phone.value;
  const address = f.address.value;
  const address2 = f.address2.value;
  const city = f.city.value;
  const state = f.state.value;
  const zipFull = f.zip.value;
  const zipShort = zipFull.slice(0, 5);

  const symptoms = f.symptoms.value;

  let gender = '(not selected)';
  for (let i = 0; i < f.gender.length; i++) {
    if (f.gender[i].checked) {
      gender = f.gender[i].value;
    }
  }

  const allConditions = ['ChickenPox', 'Measles', 'Covid19', 'SmallPox', 'Tetanus'];
  const checked = document.querySelectorAll('input[name="conditions"]:checked');
  const checkedValues = [];
  for (let i = 0; i < checked.length; i++) {
    checkedValues.push(checked[i].value);
  }

  let vaccinated = '(not selected)';
  for (let i = 0; i < f.vaccinated.length; i++) {
    if (f.vaccinated[i].checked) {
      vaccinated = f.vaccinated[i].value;
    }
  }
  let insurance = '(not selected)';
  for (let i = 0; i < f.insurance_radio.length; i++) {
    if (f.insurance_radio[i].checked) {
      insurance = f.insurance_radio[i].value;
    }
  }

  const healthLevelVal = f.healthLevel.value;
  const salaryVal = formatMoney(f.salary.value);
  const homePriceVal = formatMoney(f.homeMin.value) + ' - ' + formatMoney(f.homeMax.value);

  const userid = f.userid.value.toLowerCase();

  let html = '<h3>PLEASE REVIEW THIS INFORMATION</h3>';
  html += '<table class="form">';
  html += '<tr><th>First, MI, Last Name:</th><td>' + fname + ' ' + middle + ' ' + lname + '</td><td>' +
    (fname && lname ? 'pass' : 'ERROR: missing name') + '</td></tr>';
  html += '<tr><th>Date of Birth:</th><td>' + dobText + '</td><td>' + dobStatus + '</td></tr>';
  html += '<tr><th>Email address:</th><td>' + email + '</td><td>' + (email ? 'pass' : 'ERROR: missing email') + '</td></tr>';
  html += '<tr><th>Phone number:</th><td>' + phone + '</td><td>' + (phone ? 'pass' : 'ERROR: missing phone') + '</td></tr>';
  html += '<tr><th>Address:</th><td>' + address + (address2 ? ', ' + address2 : '') + ', ' + city + ', ' + state + ' ' + zipShort +
    '</td><td>' + ((address && city && state && zipFull) ? 'pass' : 'ERROR: missing address info') + '</td></tr>';
  html += '</table>';

  html += '<h3>REQUESTED INFO</h3>';
  html += '<table class="form">';
  for (let i = 0; i < allConditions.length; i++) {
    const cond = allConditions[i];
    html += '<tr><th>' + cond + ':</th><td>' + (checkedValues.indexOf(cond) !== -1 ? 'Y' : 'N') + '</td><td></td></tr>';
  }
  html += '<tr><th>Vaccinated?:</th><td>' + vaccinated + '</td><td></td></tr>';
  html += '<tr><th>Insurance?:</th><td>' + insurance + '</td><td></td></tr>';
  html += '<tr><th>Health Level:</th><td>' + healthLevelVal + ' / 100</td><td></td></tr>';
  html += '<tr><th>Desired Salary:</th><td>' + salaryVal + '</td><td></td></tr>';
  html += '<tr><th>Home Price Range:</th><td>' + homePriceVal + '</td><td></td></tr>';
  html += '<tr><th>Described Symptoms:</th><td>' + (symptoms || '(none entered)') + '</td><td></td></tr>';
  html += '<tr><th>User ID:</th><td>' + userid + '</td><td></td></tr>';
  html += '<tr><th>Password:</th><td>********</td><td>(not displayed for security)</td></tr>';
  html += '</table>';

  document.getElementById('reviewArea').innerHTML = html;
}

const reviewBtn = document.getElementById('reviewBtn');
reviewBtn.addEventListener('click', buildReview);
