// Mobile menu
const hbg = document.getElementById('hbg');
const mob = document.getElementById('mob');

if (hbg && mob) {
    hbg.addEventListener('click', () => {
        hbg.classList.toggle('open');
        mob.classList.toggle('open');
    });
}

function closeMob() {
    if (hbg && mob) {
        hbg.classList.remove('open');
        mob.classList.remove('open');
    }
}

window.closeMob = closeMob;

// Home page load popup
window.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const isHomePage = path === '/' || path === '/index.html';

    if (!isHomePage) return;

    

    const closeBtn = modal.querySelector('.home-image-modal-close');
    closeBtn?.addEventListener('click', closeModal);

    document.addEventListener('keydown', onEscape);
    document.body.appendChild(modal);
    requestAnimationFrame(() => modal.classList.add('show'));
});

// Scroll reveal
const io = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('on');
            }
        });
    },
    { threshold: 0.1 }
);

document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Counter (used only if stat blocks exist)
function count(el, n, dur = 1400) {
    let start = 0;
    const step = ts => {
        if (!start) start = ts;
        const progress = Math.min((ts - start) / dur, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.floor(eased * n)}+`;
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

const sio = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target.querySelector('[data-n]');
                if (el && !el.done) {
                    el.done = true;
                    count(el, Number(el.dataset.n));
                }
            }
        });
    },
    { threshold: 0.3 }
);

document.querySelectorAll('.stat').forEach(el => sio.observe(el));

// Nav shrink
const navEl = document.getElementById('nav');
const mobMenu = document.getElementById('mob');
const isMobile = () => window.innerWidth <= 860;

function updateNav() {
    if (!navEl || !mobMenu) return;

    if (window.scrollY > 50) {
        navEl.classList.add('scrolled');
        mobMenu.style.top = isMobile() ? '72px' : '68px';
    } else {
        navEl.classList.remove('scrolled');
        mobMenu.style.top = isMobile() ? '90px' : '170px';
    }
}

window.addEventListener('scroll', updateNav);
window.addEventListener('resize', updateNav);
updateNav();

// Leadership image fallback

document.querySelectorAll('.lead-avatar-inner img').forEach(img => {
    img.addEventListener('error', () => {
        img.parentElement.classList.add('no-photo');
    });

    img.addEventListener('load', () => {
        if (img.naturalWidth < 20 || img.naturalHeight < 20) {
            img.parentElement.classList.add('no-photo');
        } else {
            img.parentElement.classList.remove('no-photo');
        }
    });
});

// Contact form (runs only where the form exists)
const emailJsConfig = {
    publicKey: 'zvPPtFTgAXPHvXWzW',
    serviceId: 'service_k3fr6s6',
    templateId: 'template_2d8cjt4',
    toEmail: 'pantamanoj08@gmail.com'
};

const emailJsReady =
    typeof emailjs !== 'undefined' &&
    emailJsConfig.publicKey !== 'YOUR_EMAILJS_PUBLIC_KEY' &&
    emailJsConfig.serviceId !== 'YOUR_EMAILJS_SERVICE_ID' &&
    emailJsConfig.templateId !== 'YOUR_EMAILJS_TEMPLATE_ID';

if (typeof emailjs !== 'undefined' && emailJsReady) {
    emailjs.init({ publicKey: emailJsConfig.publicKey });
}

function showToast(type, title, text) {
    const wrap = document.getElementById('toastWrap');
    if (!wrap) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-text">${text}</div>`;

    wrap.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 250);
    }, 3200);
}

function markInvalid(field) {
    if (!field) return;
    field.classList.add('field-invalid');
}

function clearInvalid(field) {
    if (!field) return;
    field.classList.remove('field-invalid');
}

function validateContactForm(form) {
    const firstNameField = form.querySelector('[name="first_name"]');
    const lastNameField = form.querySelector('[name="last_name"]');
    const emailField = form.querySelector('[name="email"]');
    const serviceField = form.querySelector('[name="service"]');
    const messageField = form.querySelector('[name="message"]');

    const fields = [firstNameField, lastNameField, emailField, serviceField, messageField];
    fields.forEach(clearInvalid);

    const firstName = (firstNameField?.value || '').trim();
    const lastName = (lastNameField?.value || '').trim();
    const email = (emailField?.value || '').trim();
    const service = (serviceField?.value || '').trim();
    const message = (messageField?.value || '').trim();

    const namePattern = /^[A-Za-z][A-Za-z\s'-]{1,39}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!namePattern.test(firstName)) {
        markInvalid(firstNameField);
        return { isValid: false, title: 'Invalid first name', text: 'First name should be 2 to 40 letters.' };
    }

    if (!namePattern.test(lastName)) {
        markInvalid(lastNameField);
        return { isValid: false, title: 'Invalid last name', text: 'Last name should be 2 to 40 letters.' };
    }

    if (!emailPattern.test(email) || email.length > 120) {
        markInvalid(emailField);
        return { isValid: false, title: 'Invalid email', text: 'Please enter a valid email address.' };
    }

    if (!service) {
        markInvalid(serviceField);
        return { isValid: false, title: 'Service required', text: 'Please select a service before sending.' };
    }

    if (message.length < 20) {
        markInvalid(messageField);
        return { isValid: false, title: 'Message too short', text: 'Please write at least 20 characters in the message.' };
    }

    if (message.length > 1200) {
        markInvalid(messageField);
        return { isValid: false, title: 'Message too long', text: 'Please keep the message under 1200 characters.' };
    }

    return {
        isValid: true,
        payload: {
            firstName,
            lastName,
            email,
            service,
            message
        }
    };
}

const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
    contactFormEl.querySelectorAll('input, textarea, select').forEach(field => {
        const clear = () => clearInvalid(field);
        field.addEventListener('input', clear);
        field.addEventListener('change', clear);
    });
}

async function send(e) {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('.cf-btn');
    if (!btn) return;

    const validation = validateContactForm(form);
    if (!validation.isValid) {
        showToast('error', validation.title, validation.text);
        return;
    }

    const originalText = btn.textContent;
    const { firstName, lastName, email, service, message } = validation.payload;

    btn.disabled = true;
    btn.textContent = 'Sending...';
    btn.style.opacity = '0.8';

    try {
        if (!emailJsReady) {
            throw new Error('EmailJS is not configured');
        }

        await emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, {
            to_email: emailJsConfig.toEmail,
            from_name: `${firstName} ${lastName}`.trim(),
            first_name: firstName,
            last_name: lastName,
            reply_to: email,
            email,
            service,
            message
        });

        btn.textContent = 'Message Sent';
        btn.style.background = 'linear-gradient(120deg,#2AA87A,#1558A0)';
        showToast('success', 'Message sent', 'Your message was sent successfully. We will get back to you within 24 hours.');
        form.reset();
    } catch (error) {
        btn.textContent = originalText;
        btn.style.background = '';

        if (error.message === 'EmailJS is not configured') {
            showToast('error', 'EmailJS not configured', 'Add your EmailJS public key, service ID, and template ID in the script before sending.');
        } else {
            showToast('error', 'Sending failed', 'The form could not be delivered through EmailJS right now. Please try again in a moment.');
        }
    } finally {
        setTimeout(() => {
            btn.disabled = false;
            btn.textContent = originalText;
            btn.style.opacity = '';
            if (btn.textContent === originalText) {
                btn.style.background = '';
            }
        }, 1800);
    }
}

window.send = send;
