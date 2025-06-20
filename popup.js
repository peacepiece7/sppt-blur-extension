document.addEventListener('DOMContentLoaded', () => {
  const allInputs = [
    'common-blurEmptyTd',
    'common-excludeList',
    'common-includeList',
    'horizen-blurEmptyTd',
    'horizen-excludeList',
    'selector-list',
    'primevue-blurEmptyTd',
    'primevue-excludeList',
  ]

  // Load settings from localStorage
  allInputs.forEach((id) => {
    const input = document.getElementById(id)
    const storedValue = localStorage.getItem(id)
    if (storedValue !== null) {
      if (input.type === 'checkbox') {
        input.checked = storedValue === 'true'
      } else {
        input.value = storedValue
      }
    }
  })

  // Save settings to localStorage on change
  allInputs.forEach((id) => {
    const input = document.getElementById(id)
    const eventType = input.type === 'checkbox' ? 'change' : 'input'
    input.addEventListener(eventType, () => {
      const value = input.type === 'checkbox' ? input.checked : input.value
      localStorage.setItem(id, value)
    })
  })

  // Add event listeners for reset buttons
  document.querySelectorAll('.reset-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.target
      const input = document.getElementById(targetId)
      input.value = ''
      localStorage.removeItem(targetId)
    })
  })
})

document.getElementById('run-common').addEventListener('click', () => {
  const blurEmptyTd = document.getElementById('common-blurEmptyTd').checked
  const excludeList = document
    .getElementById('common-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const includeList = document
    .getElementById('common-includeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'blurTableCommon',
      params: { blurEmptyTd, excludeList, includeList },
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})

document.getElementById('run-horizen').addEventListener('click', () => {
  const blurEmptyTd = document.getElementById('horizen-blurEmptyTd').checked
  const excludeList = document
    .getElementById('horizen-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'blurTableHorizenCommon',
      params: { blurEmptyTd, excludeList },
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})

document.getElementById('run-selector').addEventListener('click', () => {
  const list = document
    .getElementById('selector-list')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'blurBySelectorList',
      params: { list },
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})

document.getElementById('run-primevue').addEventListener('click', () => {
  const blurEmptyTd = document.getElementById('primevue-blurEmptyTd').checked
  const excludeList = document
    .getElementById('primevue-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'blurPrimevueTable',
      params: { blurEmptyTd, excludeList },
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})

document.getElementById('run-detailed').addEventListener('click', () => {
  const commonBlurEmptyTd =
    document.getElementById('common-blurEmptyTd').checked
  const commonExcludeList = document
    .getElementById('common-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const commonIncludeList = document
    .getElementById('common-includeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const horizenBlurEmptyTd = document.getElementById(
    'horizen-blurEmptyTd'
  ).checked
  const horizenExcludeList = document
    .getElementById('horizen-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'runMultiple',
      actions: [
        {
          type: 'blurTableCommon',
          params: {
            blurEmptyTd: commonBlurEmptyTd,
            excludeList: commonExcludeList,
            includeList: commonIncludeList,
          },
        },
        {
          type: 'blurTableHorizenCommon',
          params: {
            blurEmptyTd: horizenBlurEmptyTd,
            excludeList: horizenExcludeList,
          },
        },
      ],
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})

document.getElementById('run-status').addEventListener('click', () => {
  const primevueBlurEmptyTd = document.getElementById(
    'primevue-blurEmptyTd'
  ).checked
  const primevueExcludeList = document
    .getElementById('primevue-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const selectorList = document
    .getElementById('selector-list')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'runMultiple',
      actions: [
        {
          type: 'blurPrimevueTable',
          params: {
            blurEmptyTd: primevueBlurEmptyTd,
            excludeList: primevueExcludeList,
          },
        },
        {
          type: 'blurBySelectorList',
          params: { list: selectorList },
        },
      ],
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})

document.getElementById('run-all').addEventListener('click', () => {
  const commonBlurEmptyTd =
    document.getElementById('common-blurEmptyTd').checked
  const commonExcludeList = document
    .getElementById('common-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const commonIncludeList = document
    .getElementById('common-includeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const horizenBlurEmptyTd = document.getElementById(
    'horizen-blurEmptyTd'
  ).checked
  const horizenExcludeList = document
    .getElementById('horizen-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  const primevueBlurEmptyTd = document.getElementById(
    'primevue-blurEmptyTd'
  ).checked
  const primevueExcludeList = document
    .getElementById('primevue-excludeList')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  const selectorList = document
    .getElementById('selector-list')
    .value.split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const message = {
      type: 'runMultiple',
      actions: [
        {
          type: 'blurTableCommon',
          params: {
            blurEmptyTd: commonBlurEmptyTd,
            excludeList: commonExcludeList,
            includeList: commonIncludeList,
          },
        },
        {
          type: 'blurTableHorizenCommon',
          params: {
            blurEmptyTd: horizenBlurEmptyTd,
            excludeList: horizenExcludeList,
          },
        },
        {
          type: 'blurPrimevueTable',
          params: {
            blurEmptyTd: primevueBlurEmptyTd,
            excludeList: primevueExcludeList,
          },
        },
        {
          type: 'blurBySelectorList',
          params: { list: selectorList },
        },
      ],
    }
    console.log('Sending message to tab:', tabs[0].id, message)
    chrome.tabs.sendMessage(tabs[0].id, message)
  })
})
