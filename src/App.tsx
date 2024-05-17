import React, { useEffect, useState } from 'react'
import './App.css'
import Controls from './Components/Controls'

type ItemID = `${string}-${string}-${string}-${string}-${string}`
interface Item {
  id: ItemID,
  timestamp: number,
  text: string
}

// const INITIAL_TODO: Item [] = [
//   {
//     id: crypto.randomUUID(),
//     timestamp: Date.now(),
//     text: '10 PullUps'
//   },
//   {
//     id: crypto.randomUUID(),
//     timestamp: Date.now(),
//     text: '10min corriendo'
//   },
//   {
//     id: crypto.randomUUID(),
//     timestamp: Date.now(),
//     text: 'Rutina Tabata'
//   },
//   {
//     id: crypto.randomUUID(),
//     timestamp: Date.now(),
//     text: 'Burpees'
//   },
// ]



function App() {
  // states
  const [ isSave, setIsSave ] = useState(false)
  const [ currentDataInput , setCurrentDataInput ] = useState({id:'', text:''}) 
  const [completeExercise, setCompleteExercise] = useState<Item[]>(() => {
    const storedItems = localStorage.getItem('completeEx');
    return storedItems ? JSON.parse(storedItems) : [];
  });
  const [items, setItems] = useState<Item[]>(() => {
    const storedItems = localStorage.getItem('items');
    return storedItems ? JSON.parse(storedItems) : [];
  });

  // Elements DOM
  const modal = document.getElementById('modal')
  const modal_card = document.getElementById('modal_card')


  // Arrow Functions
  const updateItems = () => {
    const storedItems = localStorage.getItem('items');
    if (storedItems) {
      setItems(JSON.parse(storedItems));
    }
  };

  const handleUpdateExercise = (itemIdToUpdate:string, updateItem:string) =>{
    const updatedItem = {
      id: itemIdToUpdate,
      timestamp: Date.now(),
      text: updateItem
    }

    const storedItems = localStorage.getItem('items')
    const parsedItems = storedItems ? JSON.parse(storedItems) : null;
    const itemIndex = parsedItems.findIndex((item: { id: string }) => item.id === itemIdToUpdate);

    if (itemIndex !== -1) {
      parsedItems[itemIndex] = updatedItem;
      localStorage.setItem('items', JSON.stringify(parsedItems));
      updateItems();
    } else {
      console.error('El elemento especificado no se encontró en el localStorage.');
    }
  }

  const handleItemChange = (itemId: string, newText: string) => {
    console.log('neeeew' , newText, 'de', itemId);
    setCurrentDataInput({
      id: itemId,
      text: newText
    })
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, text: newText } : item
      )
    );
  };

  const handleKeyDown = (item: Item, event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsSave(true)
      handleUpdateExercise(item.id, item.text)
      console.log('Enter presionado en el ítem con ID:', item);
    }
  };

  const handleOnBlur = () => {
    if (isSave) return
    modal?.classList.add('modal_active')
    modal_card?.classList.add('modal_card_active')
  };

  const handleDeleteItem = (id:ItemID)=> {
    console.log('ccc', completeExercise, id);
    setItems(prevItems => {
      const afterDelete = prevItems.filter(currentItem => currentItem.id !== id)
      localStorage.setItem("items", JSON.stringify(afterDelete))
      updateItems()
      return afterDelete
    }) 
    setCompleteExercise(prevItems => {
      const afterDelete = prevItems.filter(currentItem => currentItem.id !== id)
      localStorage.setItem("completeEx", JSON.stringify(afterDelete))
      updateItems()
      return afterDelete
    }) 
  }

  const handleSaveFromModal = () =>{   
    const { id , text } = currentDataInput;
    if (isSave) return
    handleUpdateExercise(id, text)
    setIsSave(true)
    modal?.classList.remove('modal_active')
    modal_card?.classList.remove('modal_card_active')
  }

  const handleCompleteExercise = (item:Item) => {
    setItems(prevItems => {
      const afterDelete = prevItems.filter(currentItem => currentItem.id !== item.id)
      localStorage.setItem("items", JSON.stringify(afterDelete))
      updateItems()
      return afterDelete
    }) 

    setCompleteExercise(prevItems => [...prevItems, item])
    const storedCompleteEx = localStorage.getItem("completeEx")
    const completeEx = storedCompleteEx ? JSON.parse(storedCompleteEx) : []
    completeEx.push(item)
    localStorage.setItem("completeEx", JSON.stringify(completeEx))
  } 


  useEffect(() => {
    updateItems();
  }, []);
  return (
    <>
      <main className='pb20 relative'>
        <Bar/>
        <Controls updateItems={updateItems} items={items} />
        <section className='flex flex-col items-center justify-center mt-10'>
          <div className="max-w-[560px] w-full">

            <header className='flex items-end justify-between pb-1.5 gap-3 text-sm'>
              <div className="flex gap-3 items-end">
                <p>ToDo</p>
                {/* {idx === items.length - 1 && <p>Hay un total de {items.length} elementos.</p>} */}
                <p className='text-xs text-gray-400'>{items ? items.length : '' } ejercicios</p>
              </div>
              <p className='text-xs text-gray-400 ml-[6.5rem]'>fecha</p>
              <p className='text-xs text-gray-400'>Control</p>
            </header>

            <div className="h-[1px] w-full bg-gray-600"></div>

            <article className="mt-5">
              <ul>
                {
                  items.length === 0 ? (
                    <p className='text-xs'>
                      <strong>Aún no hay ejercios</strong>
                    </p>
                  ): (
                    items.map((item) =>{
                      return (
          
                          <li key={item.id}  className="text-sm flex items-center justify-between py-2 hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer">
                            <div className="flex gap-4 items-center">
                              <button onClick={()=>{handleCompleteExercise(item)}} className="h-4 w-4 border-2 rounded-full"></button>
                              <input 
                              type="text" 
                              value={item.text || ''}  
                              onChange={e => handleItemChange(item.id, e.target.value)}
                              onBlur={() =>{handleOnBlur()}} 
                              onKeyDown={e => handleKeyDown(item, e)}
                              onFocus={() =>{setIsSave(false)}}
                              className='bg-transparent outline-none'/>
                            </div>
                            <p>Nov, 11</p>
                            <button onClick={() =>{handleDeleteItem(item.id)}}>
                              <Delete02Icon/>
                            </button>
                          </li>
            
                        
                      );
                    })
                  )
                }
              </ul>
            </article>
          </div>
        </section>
        <section className='flex flex-col items-center justify-center mt-10'>
          <div className="max-w-[560px] w-full">

            <header className='flex items-end justify-between pb-1.5 gap-3 text-sm'>
              <div className="flex gap-3 items-end">
                <p>Completados</p>
                <p className='text-xs text-gray-400'>3 items</p>
              </div>
              <p className='text-xs text-gray-400'>deber</p>
            </header>

            <div className="h-[1px] w-full bg-gray-600"></div>

            <article className="mt-5">
              {
                completeExercise.length === 0 ? (
                  <p className='text-xs'>
                    <strong>no hay ejercios COMPLETADOS</strong>
                  </p>
                ) : (
                  completeExercise.map((item) =>{
                    return (
                      <>
                        <li key={item.id} role='inputComplete' className="text-sm flex items-center justify-between py-2 hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer">
                          <div className="flex gap-4 items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" color="currentColor" fill="none">
                              <path d="M15 2.4578C14.053 2.16035 13.0452 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 10.9548 21.8396 9.94704 21.5422 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                              <path d="M8.5 9.5L12 13L21.0002 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <p style={{textDecoration:'line-through'}}>{item.text}</p>
                          </div>
                          <p>Nov, 11</p>
                          <button className='btnComplete' onClick={() =>{handleDeleteItem(item.id)}}>
                            <Delete02Icon/>
                          </button>
                        </li>
                      </>
                      
                    );
                  })
                )
              }
            </article>
          </div>
        </section>
        <section id='modal' className='absolute top-0 w-full h-full backdrop-blur-sm flex items-start justify-center opacity-0 -z-10 transition-all duration-1000'>
          <div id='modal_card' className="border-[1px] bg-white text-black w-fit py-5 px-9 rounded-lg flex items-center transition-all duration-300 justify-between gap-10 -translate-y-32 scale-50">
            <svg className='animate-bounce' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="#000000" fill="none">
              <path d="M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <aside className="flex flex-col gap-1.5">
              <h3 className='text-sm font-bold'>No se han guardado los cambios ¿Quieres guardarlos?</h3>
              <p className='text-sm max-w-[350px]'><strong className='lowercase text-xs'>importante :</strong> Oprimir "enter" al modificar un ejercicio para que se guarde correctamente.</p>
            </aside>
            <button onClick={() => {handleSaveFromModal()}}>Guardar</button>
          </div>
        </section>
      </main>
      
    </>
  )
}

const Bar = () => {
  return (
    <nav className="flex items-center justify-between gap-2 py-10 mx-5">
      <section className='flex items-center justify-start flex-grow basis-0'>
        <img src="/logo.svg" alt="" className='w-6' />
        <img src="/src/icons/slash.svg" alt="" className='scale-110' />

        <div className="flex items-center justify-center transition-all duration-200 py-1 px-2 gap-2 hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer">
          <div className="w-3 h-3 bg-[#0182f6] rounded-lg"></div>
          <p className='text-xs text-gray-400'>Michelle Lara</p>
          <div className="p-1 bg-[#2f2f2f] rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-move-vertical" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 18l3 3l3 -3" /><path d="M12 15v6" /><path d="M15 6l-3 -3l-3 3" /><path d="M12 3v6" /></svg>
          </div>
        </div>
      </section>

      <h1 className='text-2xl font-semibold'>FitFocus</h1>
      
      <div className="flex-grow basis-0 flex items-center justify-end transition-all duration-200 py-1 px-2 gap-2">
        <div className=" hover:bg-[#2f2f2f] hover:rounded-lg cursor-pointer flex items-center justify-center gap-2 py-1.5 px-3">
          <div className="w-3 h-3 bg-[#e3601a] rounded-lg"></div>
          <p className='text-xs text-gray-400'>Cardio</p>
          <div className="">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-arrows-move-vertical" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 18l3 3l3 -3" /><path d="M12 15v6" /><path d="M15 6l-3 -3l-3 3" /><path d="M12 3v6" /></svg>
          </div>
        </div>
      </div>
    </nav>
  )
}


const Delete02Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={20} height={20} color={"currentColor"} fill={"none"} {...props}>
    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9.5 16.5L9.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M14.5 16.5L14.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default App
