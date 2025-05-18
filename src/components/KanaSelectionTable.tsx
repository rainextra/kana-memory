import React from 'react';
import { KanaCharacter } from '../types';

interface KanaSelectionTableProps {
  kanaList: KanaCharacter[];
  selected: string[];
  onToggle: (kana: KanaCharacter) => void;
}

const kanaRows = [
  { label: 'a', sounds: ['a', 'i', 'u', 'e', 'o'] },
  { label: 'k', sounds: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { label: 's', sounds: ['sa', 'shi', 'su', 'se', 'so'] },
  { label: 't', sounds: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { label: 'n', sounds: ['na', 'ni', 'nu', 'ne', 'no'] },
  { label: 'h', sounds: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { label: 'm', sounds: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { label: 'y', sounds: ['ya', '', 'yu', '', 'yo'] },
  { label: 'r', sounds: ['ra', 'ri', 'ru', 're', 'ro'] },
  { label: 'w', sounds: ['wa', '', '', '', 'wo'] },
  { label: 'sp', sounds: ['', '', '', '', 'n'] },
];

const KanaSelectionTable: React.FC<KanaSelectionTableProps> = ({ kanaList, selected, onToggle }) => {
  const getKana = (romaji: string) =>
    kanaList.find((kana) => kana.romaji === romaji);

  return (
    <table className="w-full border-collapse text-center text-sm">
      <thead>
        <tr>
          <th className="p-2 text-left text-xs"> </th>
          {['A', 'I', 'U', 'E', 'O'].map((col) => (
            <th key={col} className="px-2 py-1 font-semibold text-gray-600">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {kanaRows.map((row) => (
          <tr key={row.label}>
            <td className="pr-2 py-2 font-medium text-gray-500">{row.label}</td>
            {row.sounds.map((romaji, colIndex) => {
              const kana = getKana(romaji);
              return (
                <td key={colIndex} className="p-1">
                  {kana ? (
                    <label className="cursor-pointer inline-flex flex-col items-center justify-center p-2 w-14 h-14 border rounded shadow-sm hover:bg-gray-50">
                      <span className="text-indigo-600 text-lg">{kana.kana}</span>
                      <span className="text-xs text-gray-500">{kana.romaji}</span>
                      <input
                        type="checkbox"
                        checked={selected.includes(kana.romaji)}
                        onChange={() => onToggle(kana)}
                        className="mt-1"
                      />
                    </label>
                  ) : (
                    <div className="w-14 h-14" />
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default KanaSelectionTable;
