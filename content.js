console.log('content.js loaded')
// blurTableCommon, blurTableHorizenCommon, blurBySelectorList, blurPrimevueTable 함수 정의 및 메시지 리스너

function blurTableCommon({
  blurEmptyTd = true,
  blurInput = true,
  excludeList = [],
  includeList = [],
}) {
  let excludeIndexes = []
  let targetIndex = -1

  ;[
    ...document.querySelectorAll('.table-common'),
    ...document.querySelectorAll('table:not(.horizon)'),
    ...document.querySelectorAll('table'),
  ].forEach((table, idx) => {
    console.log('blur extension - matched table: ', table)
    const ths = Array.from(table.querySelectorAll('thead tr th'))
    if (idx % 2 === 0 && ths.length) {
      excludeIndexes = ths
        .map((th, idx) =>
          excludeList.some((ex) =>
            th.textContent?.replace(/\s/g, '').includes(ex.replace(/\s/g, ''))
          ) ||
          (blurEmptyTd && th.textContent === '')
            ? idx
            : -1
        )
        .filter((idx) => idx !== -1)
      targetIndex = ths.findIndex((th) =>
        includeList.some((ex) =>
          th.textContent?.replace(/\s/g, '').includes(ex.replace(/\s/g, ''))
        )
      )
    }

    if (idx % 2 === 1) {
      table.querySelectorAll('tbody tr').forEach((tr) => {
        tr.querySelectorAll('td').forEach((td, tdIdx) => {
          // blurInput 체크: td의 children에 input이 있으면 blur 미적용

          const hasInput = !blurInput && td.querySelector('input')
          if (excludeIndexes.includes(tdIdx) || hasInput) {
            td.style.filter = ''
          } else if (tdIdx === targetIndex && !excludeIndexes.includes(tdIdx)) {
            td.style.filter = 'blur(3px)'
          } else {
            td.style.filter = 'blur(3px)'
          }
        })
      })
    }
  })
}

function blurDataTable({
  blurEmptyTd = true,
  blurInput = true,
  excludeList = [],
  includeList = [],
}) {
  let excludeIndexes = []
  let targetIndex = -1

  ;[...document.querySelectorAll('.v-data-table table')].forEach(
    (table, idx) => {
      console.log('blur extension - matched table: ', table)
      const ths = Array.from(table.querySelectorAll('thead tr th'))
      if (idx % 2 === 0 && ths.length) {
        excludeIndexes = ths
          .map((th, idx) =>
            excludeList.some((ex) =>
              th.textContent?.replace(/\s/g, '').includes(ex.replace(/\s/g, ''))
            ) ||
            (blurEmptyTd && th.textContent === '')
              ? idx
              : -1
          )
          .filter((idx) => idx !== -1)
        targetIndex = ths.findIndex((th) =>
          includeList.some((ex) =>
            th.textContent?.replace(/\s/g, '').includes(ex.replace(/\s/g, ''))
          )
        )
      }

      if (idx % 2 === 1) {
        table.querySelectorAll('tbody tr').forEach((tr) => {
          tr.querySelectorAll('td').forEach((td, tdIdx) => {
            // blurInput 체크: td의 children에 input이 있으면 blur 미적용

            const hasInput = !blurInput && td.querySelector('input')
            if (excludeIndexes.includes(tdIdx) || hasInput) {
              td.style.filter = ''
            } else if (
              tdIdx === targetIndex &&
              !excludeIndexes.includes(tdIdx)
            ) {
              td.style.filter = 'blur(3px)'
            } else {
              td.style.filter = 'blur(3px)'
            }
          })
        })
      }
    }
  )
}

function blurTableHorizenCommon({
  blurEmptyTd = true,
  blurInput = true,
  excludeList = [],
}) {
  document.querySelectorAll('.table-common.horizon').forEach((table) => {
    console.log('blur extension - matched table: ', table)
    table.querySelectorAll('tr').forEach((tr) => {
      const cells = Array.from(tr.children)
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i]
        if (cell.tagName.toLowerCase() === 'th') continue

        const prevCell = cells[i - 1]
        // blurInput 체크: cell의 children에 input이 있으면 blur 미적용
        const hasInput = !blurInput && cell.querySelector('input')
        if (
          prevCell &&
          prevCell.tagName.toLowerCase() === 'th' &&
          (excludeList.some((ex) =>
            prevCell.textContent
              ?.replace(/\s/g, '')
              .includes(ex.replace(/\s/g, ''))
          ) ||
            (blurEmptyTd && prevCell.textContent === ''))
        ) {
          cell.style.filter = ''
        } else if (hasInput) {
          cell.style.filter = ''
        } else {
          cell.style.filter = 'blur(3px)'
        }
      }
    })
  })
}

function blurBySelectorList({ list = [] }) {
  console.log('blur extension - matched list: ', list)
  list?.forEach((item) => {
    document.querySelectorAll(item).forEach((item) => {
      item.style.filter = 'blur(3px)'
      item.style.pointerEvents = 'none'
      item.style.userSelect = 'none'
    })
  })
}

function blurPrimevueTable({ blurEmptyTd = true, excludeList = [] }) {
  const table = document.querySelector('.p-datatable-table')
  console.log('blur extension - matched table: ', table)
  if (!table) return
  const ths = table.querySelectorAll('thead th')
  const excludeIndexes = []
  ths?.forEach((th, idx) => {
    const title = th
      .querySelector('.p-datatable-column-title')
      ?.textContent?.trim()
    if (excludeList.includes(title)) excludeIndexes.push(idx)
  })

  const trs = table.querySelectorAll('tbody tr')
  trs?.forEach((tr) => {
    tr.querySelectorAll('td').forEach((td, idx) => {
      const div = td.querySelector('div')
      if (!div) return
      if (excludeIndexes.includes(idx)) {
        div.style.filter = ''
        div.style.opacity = ''
      } else if (blurEmptyTd && td.textContent === '') {
        div.style.filter = ''
        div.style.opacity = ''
      } else {
        div.style.filter = 'blur(3px)'
        div.style.opacity = '0.5'
      }
    })
  })
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('Message received in content script:', msg)
  if (msg.type === 'runMultiple') {
    msg.actions.forEach((action) => {
      switch (action.type) {
        case 'blurTableCommon':
          blurTableCommon(action.params)
          break
        case 'blurTableHorizenCommon':
          blurTableHorizenCommon(action.params)
          break
        case 'blurBySelectorList':
          blurBySelectorList(action.params)
          break
        case 'blurPrimevueTable':
          blurPrimevueTable(action.params)
          break
        case 'blurDataTable':
          blurDataTable(action.params)
          break
      }
    })
  } else if (msg.type === 'blurTableCommon') {
    blurTableCommon(msg.params)
  } else if (msg.type === 'blurTableHorizenCommon') {
    blurTableHorizenCommon(msg.params)
  } else if (msg.type === 'blurBySelectorList') {
    blurBySelectorList(msg.params)
  } else if (msg.type === 'blurPrimevueTable') {
    blurPrimevueTable(msg.params)
  } else if (msg.type === 'blurDataTable') {
    blurDataTable(msg.params)
  }
})
