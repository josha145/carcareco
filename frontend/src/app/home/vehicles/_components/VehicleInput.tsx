'use client'
import FormInput from '@/_components/FormInput';
import { useRouter } from 'next/navigation';
import FormTextArea from '@/_components/FormTextArea';
import PrimaryButton from '@/_components/PrimaryButton';
import SecondaryButton from '@/_components/SecondaryButton';
import { IVehicleData } from '../model';
import FormLabel from '@/_components/FormLabel';
import TypeAheadCombobox from '../../_components/TypeAheadCombobox';
import { ClientsCombobox } from '../../_components/SearchCombobox';
import data from './car_brands.json';
import { useState } from 'react';

interface ICarProducer {
  name: string
  logo?: string
}

function makeIconClass(name: string) {
  return 'car-' + name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/./g, '')
    .replace(/'/g, '')
    .replace(/s+/g, '-');
}

export default function VehicleInput({
  vehicle
}: {
  vehicle?: IVehicleData | undefined
}) {
  const router = useRouter()
  const [producer, setProducer] = useState<ICarProducer | null>(
    !vehicle ? null : { name: vehicle.producer }
  )

  return (
    <>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <FormLabel name='producer' label='Car make'></FormLabel>
              <TypeAheadCombobox
                name="producer"
                defaultValue={producer}
                displayFormatter={(item) => !item ? '' : item.name}
                optionFormatter={(item) => !item ? null : (
                  <>
                    <i
                      className={`car ${makeIconClass(item.name)} text-lg leading-none`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.name}</span>
                  </>
                )}
                placeholder="Enter car make"
                onItemChange={(item) => {
                  setProducer(item);
                }}
                onSearch={(e, dataTarget) => {
                  const inputValue = e.currentTarget.value.trim();
                  if (inputValue) {
                    const makesFound = data.filter((make) => {
                      return make.name.toLowerCase().startsWith(inputValue.toLowerCase());
                    }) as ICarProducer[];
                    dataTarget(makesFound);
                  } else {
                    dataTarget([]);
                  }
                }}
              />
            </div>
            <div className="sm:col-span-2"><FormInput name='model' defaultValue={vehicle?.model} label='Vehicle model'></FormInput></div>
            <div className="sm:col-span-2"><FormInput name='vin' defaultValue={vehicle?.vin} label='VIN Code'></FormInput></div>
            <div className="sm:col-span-2"><FormInput name='regNr' defaultValue={vehicle?.regNr} label='Rego'></FormInput></div>
            <div className="sm:col-span-2"><FormInput name='odo' defaultValue={vehicle?.odo} label='Odometer'></FormInput></div>
            <div className="col-span-full">
              <FormLabel name='ownerId' label='Owner'></FormLabel>
              <ClientsCombobox
                name='ownerId'
                defaultValue={{
                  text: vehicle?.ownerName ?? '',
                  value: vehicle?.ownerId ?? '',
                }}>
              </ClientsCombobox>
            </div>
          </div>
        </div>
      </div>
      <div className="border-b border-gray-900/10 pb-12">
        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="col-span-full">
            <FormTextArea name='about' label='About' defaultValue={vehicle?.description}>
            </FormTextArea>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <SecondaryButton onClick={() => router.back()}>Cancel</SecondaryButton>
        <PrimaryButton onClick={() => { }}>Save</PrimaryButton>
      </div>
    </>
  )
}
