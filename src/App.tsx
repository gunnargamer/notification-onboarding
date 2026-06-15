import { PhoneFrame } from './components/PhoneFrame'
import { useApp } from './state/AppContext'

export default function App() {
  const { state } = useApp()
  return (
    <PhoneFrame>
      <div className="flex flex-1 items-center justify-center p-6 text-text-secondary">
        screen: {state.screen}
      </div>
    </PhoneFrame>
  )
}
