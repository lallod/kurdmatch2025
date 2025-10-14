import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Users } from 'lucide-react';

interface GroupedEthnicitySelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

const GroupedEthnicitySelector = ({ value, onChange }: GroupedEthnicitySelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-purple-400" />
        <Label className="text-white">Ethnicity</Label>
      </div>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="bg-white/10 backdrop-blur border-white/20 text-white">
          <SelectValue placeholder="Select your ethnicity" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 max-h-96">
          <SelectGroup>
            <SelectLabel className="text-purple-300 font-semibold">🟣 Kurdish (Primary)</SelectLabel>
            <SelectItem value="Kurdish – Kurmanji" className="text-white hover:bg-gray-800 pl-6">Kurdish – Kurmanji</SelectItem>
            <SelectItem value="Kurdish – Sorani" className="text-white hover:bg-gray-800 pl-6">Kurdish – Sorani</SelectItem>
            <SelectItem value="Kurdish – Zaza / Dimili" className="text-white hover:bg-gray-800 pl-6">Kurdish – Zaza / Dimili</SelectItem>
            <SelectItem value="Kurdish – Other" className="text-white hover:bg-gray-800 pl-6">Kurdish – Other</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-green-300 font-semibold">🟢 Kurdish – Mixed (Middle East & Caucasus)</SelectLabel>
            <SelectItem value="Kurdish – Arab" className="text-white hover:bg-gray-800 pl-6">Kurdish – Arab</SelectItem>
            <SelectItem value="Kurdish – Turkish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Turkish</SelectItem>
            <SelectItem value="Kurdish – Persian / Iranian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Persian / Iranian</SelectItem>
            <SelectItem value="Kurdish – Assyrian / Armenian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Assyrian / Armenian</SelectItem>
            <SelectItem value="Kurdish – Caucasian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Caucasian</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-blue-300 font-semibold">🔵 Kurdish – European (Western & Central)</SelectLabel>
            <SelectItem value="Kurdish – German" className="text-white hover:bg-gray-800 pl-6">Kurdish – German</SelectItem>
            <SelectItem value="Kurdish – French" className="text-white hover:bg-gray-800 pl-6">Kurdish – French</SelectItem>
            <SelectItem value="Kurdish – Dutch" className="text-white hover:bg-gray-800 pl-6">Kurdish – Dutch</SelectItem>
            <SelectItem value="Kurdish – Belgian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Belgian</SelectItem>
            <SelectItem value="Kurdish – Swiss" className="text-white hover:bg-gray-800 pl-6">Kurdish – Swiss</SelectItem>
            <SelectItem value="Kurdish – Austrian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Austrian</SelectItem>
            <SelectItem value="Kurdish – Luxembourgish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Luxembourgish</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-blue-300 font-semibold">🔵 Kurdish – European (Northern)</SelectLabel>
            <SelectItem value="Kurdish – Swedish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Swedish</SelectItem>
            <SelectItem value="Kurdish – Norwegian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Norwegian</SelectItem>
            <SelectItem value="Kurdish – Danish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Danish</SelectItem>
            <SelectItem value="Kurdish – Finnish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Finnish</SelectItem>
            <SelectItem value="Kurdish – Icelandic" className="text-white hover:bg-gray-800 pl-6">Kurdish – Icelandic</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-blue-300 font-semibold">🔵 Kurdish – European (Southern)</SelectLabel>
            <SelectItem value="Kurdish – Italian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Italian</SelectItem>
            <SelectItem value="Kurdish – Spanish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Spanish</SelectItem>
            <SelectItem value="Kurdish – Portuguese" className="text-white hover:bg-gray-800 pl-6">Kurdish – Portuguese</SelectItem>
            <SelectItem value="Kurdish – Greek" className="text-white hover:bg-gray-800 pl-6">Kurdish – Greek</SelectItem>
            <SelectItem value="Kurdish – Maltese" className="text-white hover:bg-gray-800 pl-6">Kurdish – Maltese</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-blue-300 font-semibold">🔵 Kurdish – European (Eastern Europe & Balkans)</SelectLabel>
            <SelectItem value="Kurdish – Polish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Polish</SelectItem>
            <SelectItem value="Kurdish – Czech" className="text-white hover:bg-gray-800 pl-6">Kurdish – Czech</SelectItem>
            <SelectItem value="Kurdish – Slovak" className="text-white hover:bg-gray-800 pl-6">Kurdish – Slovak</SelectItem>
            <SelectItem value="Kurdish – Hungarian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Hungarian</SelectItem>
            <SelectItem value="Kurdish – Romanian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Romanian</SelectItem>
            <SelectItem value="Kurdish – Bulgarian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Bulgarian</SelectItem>
            <SelectItem value="Kurdish – Serbian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Serbian</SelectItem>
            <SelectItem value="Kurdish – Bosnian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Bosnian</SelectItem>
            <SelectItem value="Kurdish – Croatian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Croatian</SelectItem>
            <SelectItem value="Kurdish – Albanian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Albanian</SelectItem>
            <SelectItem value="Kurdish – Slovenian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Slovenian</SelectItem>
            <SelectItem value="Kurdish – Ukrainian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Ukrainian</SelectItem>
            <SelectItem value="Kurdish – Russian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Russian</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-blue-300 font-semibold">🔵 Kurdish – European (British Isles)</SelectLabel>
            <SelectItem value="Kurdish – British" className="text-white hover:bg-gray-800 pl-6">Kurdish – British</SelectItem>
            <SelectItem value="Kurdish – Scottish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Scottish</SelectItem>
            <SelectItem value="Kurdish – Welsh" className="text-white hover:bg-gray-800 pl-6">Kurdish – Welsh</SelectItem>
            <SelectItem value="Kurdish – Irish" className="text-white hover:bg-gray-800 pl-6">Kurdish – Irish</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-orange-300 font-semibold">🟠 Kurdish – Other Mixed</SelectLabel>
            <SelectItem value="Kurdish – Central Asian" className="text-white hover:bg-gray-800 pl-6">Kurdish – Central Asian</SelectItem>
            <SelectItem value="Kurdish – African" className="text-white hover:bg-gray-800 pl-6">Kurdish – African</SelectItem>
            <SelectItem value="Kurdish – American / Canadian / Australian" className="text-white hover:bg-gray-800 pl-6">Kurdish – American / Canadian / Australian</SelectItem>
            <SelectItem value="Kurdish – Other Mixed" className="text-white hover:bg-gray-800 pl-6">Kurdish – Other Mixed</SelectItem>
          </SelectGroup>

          <SelectGroup>
            <SelectLabel className="text-gray-300 font-semibold">⚪ Non-Kurdish Options</SelectLabel>
            <SelectItem value="Arab" className="text-white hover:bg-gray-800 pl-6">Arab</SelectItem>
            <SelectItem value="Turkish" className="text-white hover:bg-gray-800 pl-6">Turkish</SelectItem>
            <SelectItem value="Persian / Iranian" className="text-white hover:bg-gray-800 pl-6">Persian / Iranian</SelectItem>
            <SelectItem value="Assyrian / Armenian" className="text-white hover:bg-gray-800 pl-6">Assyrian / Armenian</SelectItem>
            <SelectItem value="Caucasian" className="text-white hover:bg-gray-800 pl-6">Caucasian</SelectItem>
            <SelectItem value="European" className="text-white hover:bg-gray-800 pl-6">European</SelectItem>
            <SelectItem value="Central Asian" className="text-white hover:bg-gray-800 pl-6">Central Asian</SelectItem>
            <SelectItem value="African" className="text-white hover:bg-gray-800 pl-6">African</SelectItem>
            <SelectItem value="Other / Prefer not to say" className="text-white hover:bg-gray-800 pl-6">Other / Prefer not to say</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default GroupedEthnicitySelector;
