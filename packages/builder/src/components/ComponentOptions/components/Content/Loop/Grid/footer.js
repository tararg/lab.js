import React, { useState } from 'react'

import { ButtonDropdown, Button,
  DropdownToggle, DropdownMenu, DropdownItem  } from 'reactstrap'
import { range } from 'lodash'

import Icon from '../../../../../Icon'
//import FactorialModal from './components/FactorialModal'
import { useArrayContext } from '../../../../../Form/array'

import Uploader from '../../../../../Uploader'
import { saveAs } from 'file-saver'
import { parse, unparse } from 'papaparse'

const exportGrid = (data, columns) => {
  const output = unparse({
    fields: columns.map(c => c.name),
    data
  })

  return saveAs(
    new Blob(
      [ output ],
      { type: 'text/csv;charset=utf-8' }
    ),
    'loop.csv'
  )
}

export default ({ columns, data }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  //const factorialModal = createRef()
  const { addRow, overwriteAll } = useArrayContext()

  return (
    <tfoot>
      <tr>
        <td />
        <td colSpan={ columns.length }>
            { /*
          <FactorialModal ref={ factorialModal } />
            */ }
          <ButtonDropdown
            size="sm"
            className="w-100"
            isOpen={ dropdownOpen }
            toggle={ () => setDropdownOpen(!dropdownOpen) }
          >
            <Button
              block size="sm"
              outline color="muted"
              className="hover-target"
              onClick={ () => addRow() }
              onMouseUp={
                e => e.target.blur()
              }
              style={{
                paddingLeft: '32px', // 6px standard + 24px toggle width
              }}
            >
              <Icon icon="plus" />
            </Button>
            <DropdownToggle
              caret split size="sm"
              outline color="muted"
              className="hover-target"
              style={{
                width: '24px',
              }}
            />
            <DropdownMenu right>
            { /*
              <DropdownItem header>Generate</DropdownItem>
              <DropdownItem
                onClick={ () => factorialModal.current.show().then(result => {
                  overwriteAll(result.rows, result.columns)
                }) }
              >
                Factorial design
              </DropdownItem>
              */ }
              <DropdownItem divider />
              <DropdownItem header>Repeat</DropdownItem>
              <DropdownItem
                onClick={ () => {
                  const n = window.prompt('How many times?')
                  if (n) {
                    overwriteAll(
                      data.flatMap(r => range(n).map(() => r)),
                      columns,
                    )
                  }
                } }
              >
                Each row
              </DropdownItem>
              <DropdownItem
                onClick={ () => {
                  const n = window.prompt('How many times?')
                  if (n) {
                    overwriteAll(
                      range(n).flatMap(() => data),
                      columns,
                    )
                  }
                } }
              >
                Entire grid
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem header>CSV / TSV</DropdownItem>
              <Uploader
                accept="text/csv,text/tab-separated-values,.csv,.tsv"
                multiple={ false }
                onUpload={
                  ([[content]]) => {
                    // TODO: Close the dropdown when the file selector
                    // is shown. This needs some more work to make sure
                    // that the uploader component isn't removed from the
                    // page in between
                    setDropdownOpen(false)

                    const parseResult = parse(
                      content.trim(),
                      { header: true }
                    )

                    if (
                      // No detected issues
                      parseResult.errors.length === 0 ||
                      // Data is present, but no delimiter found
                      (parseResult.data && parseResult.errors.length === 1 &&
                        parseResult.errors[0].code === 'UndetectableDelimiter')
                    ) {
                      overwriteAll(
                        parseResult.data.map(r => Object.values(r)),
                        Object.keys(parseResult.data[0])
                          .map(c => ({ name: c, type: 'string' })),
                      )
                    } else {
                      console.log(
                        'CSV import found errors: ',
                        parseResult.errors
                      )
                      alert(
                        'Sorry, I couldn\'t parse that CSV file. ' +
                        'There seems to be an error. ' +
                        'Could you check it, please?'
                      )
                    }
                  }
                }
              >
                <div className="dropdown-item">
                  Import
                </div>
              </Uploader>
              <DropdownItem
                onClick={ () => exportGrid(data, columns) }
              >
                Export
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </td>
        <td />
      </tr>
    </tfoot>
  )
}
