// "use client";

// import { useState, useEffect } from "react";

// export default function recovery() {
//     const [reminders, setReminders] = useState<string[]>([]);
//     const [input, setInput] = useState("");

//     useEffect(() => {
//         const storedReminders = JSON.parse(localStorage.getItem("reminders") || "[]");
//         setReminders(storedReminders);
//     }, []);

//     const addReminder = () => {
//         if (!input.trim()) return;
//         const updatedReminders = [...reminders, input];
//         setReminders(updatedReminders);
//         localStorage.setItem("reminders", JSON.stringify(updatedReminders));
//         setInput("");
//     };

//     return (
//         <div className="max-w-md mx-auto mt-6 p-4 bg-gray-100 rounded-md">
//             <h2 className="text-lg font-semibold">Prescription Reminders</h2>

//             <div className="flex mt-2">
//                 <input
//                     type="text"
//                     value={input}
//                     onChange={(e) => setInput(e.target.value)}
//                     className="border p-2 flex-grow"
//                     placeholder="Enter reminder..."
//                 />
//                 <button onClick={addReminder} className="ml-2 bg-green-500 text-white px-4 py-2 rounded">
//                     Add
//                 </button>
//             </div>

//             <ul className="mt-4">
//                 {reminders.map((reminder, index) => (
//                     <li key={index} className="p-2 bg-white border rounded-md my-1">
//                         {reminder}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// }

export default function Recovery() {
    <div>
        Recovery
    </div>
}
