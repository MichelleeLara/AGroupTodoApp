import React, {} from 'react'

interface Item {
  id: `${string}-${string}-${string}-${string}-${string}`,
  timestamp: number,
  text: string
}

interface ControlsProps {
  updateItems: () => void;
  items: Item[];
}
window.addEventListener('keydown', function(event) {
  const input = this.document.getElementById('input');
  // Verifica si la tecla Ctrl y la tecla K están siendo presionadas
  if (event.ctrlKey && event.key === 'k') {
      event.preventDefault(); // Evita cualquier comportamiento predeterminado asociado con Ctrl + K
      input?.focus(); // Invoca la función focus en el elemento input
  }
});

export default function Controls({ updateItems }: ControlsProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { elements } = event.currentTarget;
    const input = elements.namedItem('item');
    const isInput = input instanceof HTMLInputElement;
    if (!isInput || input == null) return;

    const newItem: Item = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      text: input.value
    };

    const storedItems = localStorage.getItem('items');
    const itemsArray = storedItems ? JSON.parse(storedItems) : [];

    itemsArray.push(newItem);
    localStorage.setItem('items', JSON.stringify(itemsArray));
    input.value = ''
    updateItems();
  };


  return (
    <section className='text-gray-400 flex items-center justify-center'>
      <div className="flex flex-col items-center gap-8 max-w-screen-lg w-full">
        <h2 className='text-lg text-center'>Hola <span className='text-white'>Michelle</span>, Qué ejercicio agregamos?</h2>

        <form onSubmit={handleSubmit} role='form' className="min-w-[400px] max-w-[400px] flex items-center justify-between gap-10">
          <div className="flex gap-3.5 items-center justify-between px-2 py-2  rounded-xl w-full  border-2 border-gray-400">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none">
                <path d="M12 4V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <input id='input' name='item' role='textInput' required type="text" className='bg-transparent text-sm outline-none' placeholder='Ingresar nombre aquí'/>
            </div>
            <div className="flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none"><path d="M15 9V15H9V9H15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M15 15H18C19.6569 15 21 16.3431 21 18C21 19.6569 19.6569 21 18 21C16.3431 21 15 19.6569 15 18V15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 15.002H6C4.34315 15.002 3 16.3451 3 18.002C3 19.6588 4.34315 21.002 6 21.002C7.65685 21.002 9 19.6588 9 18.002V15.002Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M15 9.00012L15 6.00012C15 4.34327 16.3431 3.00012 18 3.00012C19.6569 3.00012 21 4.34327 21 6.00012C21 7.65698 19.6569 9.00012 18 9.00012H15Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /><path d="M9 9.00012V6.00012C9 4.34327 7.65685 3.00012 6 3.00012C4.34315 3.00012 3 4.34327 3 6.00012C3 7.65698 4.34315 9.00012 6 9.00012H9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-letter-k-small"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10.5 8v8" /><path d="M14.5 8l-3 4l3 4" /><path d="M10.5 12h1" /></svg>
            </div>
          </div>
          <button className='text-black bg-gray-400 py-2 px-4 rounded-xl text-sm'>Agregar</button>
        </form>
      </div>
    </section>
  )
}
