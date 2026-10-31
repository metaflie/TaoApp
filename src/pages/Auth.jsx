import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { signIn } from '../store/authSlice'
import { hydrate } from '../store/progressSlice'
import { readJSON, progressKey } from '../store/storage'
import { login, register } from '../store/users'
import { useLang } from '../i18n'
import Icon from '../components/Icon'
import owl from '../assets/owl.webp'

// Figma-ს ველი: რუხი „აბი“ აიქონით მარცხნივ (Username / Password Hover კომპონენტები)
function Field({ icon, error, ...props }) {
  return (
    <label className={`field ${error ? 'has-error' : ''}`}>
      <Icon name={icon} size={20} />
      <input {...props} aria-invalid={Boolean(error)} />
      {error && <span className="field-err">{error}</span>}
    </label>
  )
}

function useEnter() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  return (user) => {
    dispatch(signIn(user))
    dispatch(hydrate(readJSON(progressKey(user), {})))
    navigate(location.state?.from ?? '/profile', { replace: true })
  }
}

export function Login() {
  const { lang } = useLang()
  const ka = lang === 'ka'
  const enter = useEnter()
  const [form, setForm] = useState({ id: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!form.id || !form.password) return setError(ka ? 'შეავსე ორივე ველი' : 'Fill in both fields')
    setBusy(true)
    try {
      enter(await login(form.id, form.password))
    } catch {
      setError(ka ? 'მომხმარებელი ან პაროლი არასწორია' : 'Wrong username or password')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>{ka ? 'შესვლა' : 'LOG IN'}</h1>
        <img src={owl} alt="TAO" className="auth-owl" />
        <Field icon="user" placeholder={ka ? 'მომხმარებელი ან ელფოსტა' : 'Username'} autoComplete="username" value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
        <Field
          icon="lock"
          type="password"
          placeholder={ka ? 'პაროლი' : 'Password'}
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {error && <p className="form-err" role="alert">{error}</p>}
        <button className="btn-auth" disabled={busy}>
          {ka ? 'შესვლა' : 'LOG IN'}
        </button>
        <Link to="/signup" className="auth-switch">
          {ka ? 'არ გაქვს ანგარიში? შექმენი' : "don't have an account? create one"}
        </Link>
      </form>
    </div>
  )
}

export function Signup() {
  const { lang } = useLang()
  const ka = lang === 'ka'
  const enter = useEnter()
  const [f, setF] = useState({ firstName: '', lastName: '', username: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const validate = () => {
    const er = {}
    if (f.firstName.trim().length < 2) er.firstName = ka ? 'მინიმუმ 2 სიმბოლო' : 'At least 2 characters'
    if (f.lastName.trim().length < 2) er.lastName = ka ? 'მინიმუმ 2 სიმბოლო' : 'At least 2 characters'
    if (!/^[a-zA-Z0-9_.]{3,20}$/.test(f.username)) er.username = ka ? '3–20 ლათინური სიმბოლო' : '3–20 latin characters'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) er.email = ka ? 'ელფოსტა არასწორია' : 'Invalid email'
    if (f.password.length < 6) er.password = ka ? 'მინიმუმ 6 სიმბოლო' : 'At least 6 characters'
    if (f.confirm !== f.password) er.confirm = ka ? 'პაროლები არ ემთხვევა' : 'Passwords do not match'
    return er
  }

  const submit = async (e) => {
    e.preventDefault()
    const er = validate()
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true)
    try {
      enter(await register(f))
    } catch (err) {
      setErrors(
        err.message === 'email'
          ? { email: ka ? 'ეს ელფოსტა უკვე დარეგისტრირებულია' : 'Email already registered' }
          : { username: ka ? 'ეს სახელი დაკავებულია' : 'Username is taken' },
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card signup" onSubmit={submit} noValidate>
        <img src={owl} alt="TAO" className="auth-owl corner" />
        <h1>{ka ? 'რეგისტრაცია' : 'SIGN UP'}</h1>
        <div className="signup-fields">
          <Field icon="user" placeholder={ka ? 'სახელი' : 'First name'} value={f.firstName} onChange={set('firstName')} error={errors.firstName} autoComplete="given-name" />
          <Field icon="user" placeholder={ka ? 'გვარი' : 'Last name'} value={f.lastName} onChange={set('lastName')} error={errors.lastName} autoComplete="family-name" />
          <Field icon="id" placeholder={ka ? 'მომხმარებლის სახელი' : 'Username'} value={f.username} onChange={set('username')} error={errors.username} autoComplete="username" />
          <Field icon="mail" type="email" placeholder={ka ? 'ელფოსტა' : 'Email'} value={f.email} onChange={set('email')} error={errors.email} autoComplete="email" />
          <Field icon="lock" type="password" placeholder={ka ? 'პაროლი' : 'Password'} value={f.password} onChange={set('password')} error={errors.password} autoComplete="new-password" />
          <Field icon="lock" type="password" placeholder={ka ? 'გაიმეორე პაროლი' : 'Repeat password'} value={f.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete="new-password" />
        </div>
        <button className="btn-auth wide" disabled={busy}>
          {ka ? 'ანგარიშის შექმნა' : 'CREATE AN ACCOUNT'}
        </button>
        <Link to="/login" className="auth-switch">
          {ka ? 'უკვე გაქვს ანგარიში? შესვლა' : 'already have an account? log in'}
        </Link>
      </form>
    </div>
  )
}
