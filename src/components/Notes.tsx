import React, { useEffect, useState } from "react";
import { INoteEntry } from "src/interfaces";
import { StorageKey } from "../consts";
import { contextData, simplePrepend, watch } from "../utils/shared-utils";

export default function Notes() {
  const [notes, setNotes] = useState<INoteEntry[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    watch(StorageKey.NOTES, ({ newValue = [] }) => {
      setNotes(newValue);
    });
  }, []);

  async function addNote() {
    await simplePrepend<INoteEntry>(StorageKey.NOTES, {
      text: note,
      ...contextData(),
    });
    setNote("");
  }

  return (
    <div className="flex flex-col items-stretch gap-8 w-full p-8">
      <div className="text-2xl">
        Totally Legitimate Note Extension Nothing Strange Here
      </div>
      <div className="flex flex-row gap-2 items-stretch">
        <input
          type="text"
          className="flex-grow block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        ></input>
        <button
          className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          onClick={() => addNote()}
        >
          SAVE
        </button>
        <button
          className="bg-transparent hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded"
          onClick={() => chrome.runtime.openOptionsPage()}
        >
          THE&nbsp;GOODS
        </button>
      </div>
      {notes.map((note) => (
        <div key={note.uuid} className="flex flex-col gap-1">
          <div className="text-base">{note.text}</div>
          <div className="text-xs text-gray-300">{note.timestamp}</div>
        </div>
      ))}
    </div>
  );
}
