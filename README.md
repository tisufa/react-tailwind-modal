# @sentuh/react-tailwind-modal

A lightweight React modal library built with Tailwind CSS. It provides a declarative and promise-based way to manage modals without cluttering your components with isOpen states.

#### Key Features

- **Promise-based:** Handle modal results using `.then()` or `await`.
- **Flexible Control:** Built-in support for `size`, `centered`, `backdrop`, and `scrollable`.
- **Customizable:** Easily override styles with `wrapperClassName`, `backdropClassName`, and `contentClassName`.
- **Context-Driven:** Centralized state management via `ModalProvider`.

## 📦 Installation

```bash
npm install @sentuh/react-tailwind-modal
```

#### ⚙️ Tailwind Configuration (Required)

Because this library uses Tailwind utility classes, you must tell Tailwind to scan the library's files for styles. Choose **one** of the methods below based on your Tailwind version:

**Option A: Using CSS `@source` (Tailwind v4+)**

Add this line to your main CSS file (e.g., app.css or index.css):

```css
@import "tailwindcss";

/* Scan the library for Tailwind classes */
@source "../node_modules/@sentuh/react-tailwind-modal/dist/**/*.js";
```

**Option B: Using `tailwind.config.js` (Tailwind v3)**

Add the library path to the content array:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@sentuh/react-tailwind-modal/dist/**/*.js", // <-- Add this
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## 🚀 Demo

Try the Live Preview and explore example code here:

[StackBlitz Demo](https://stackblitz.com/edit/react-tailwind-modal "StackBlitz Demo")

## 🛠 Usage

#### 1. Wrap Your App

Wrap your root component with the `ModalProvider` to enable centralized state management.

```tsx
import { ModalProvider } from "@sentuh/react-tailwind-modal";

createRoot(document.getElementById("root")!).render(
  <ModalProvider>
    <App />
  </ModalProvider>,
);
```

### 2. Opening a Modal

There are two ways to open a modal. **Method 1** is recommended for most use cases.

##### Method 1: Passing a Component (Recommended)

Best for reusability. The library handles instantiation and passes props automatically.

```tsx
import { useModal } from "@sentuh/react-tailwind-modal";
import { AddUserModal } from "./AddUserModal";

function App() {
  const modal = useModal();

  const handleOpen = () => {
    // Pass the component itself, modal will render it internally
    modal.open(AddUserModal).then((result) => {
      console.log(result); // result { id: 1, name: 'John Doe'}
    });
  };

  return (
    <button className="btn btn-primary" onClick={handleOpen}>
      Open Modal
    </button>
  );
}
```

##### Method 2: Passing JSX Directly

Best for quick, one-off modals with inline props.

```tsx
const handleOpen = () => {
  modal.open(<AddUserModal onChange={(result) => console.log(result)} />);
};
```

### 3. Best Practice: Reusable Wrapper

To keep your UI consistent, create a base `Modal` wrapper and use it across your specific modal components.

##### Step 1: Create Modal.tsx

```tsx
import { useActiveModal } from "@sentuh/react-tailwind-modal";
import type { ReactNode } from "react";

export const Modal = ({
  header,
  children,
  footer,
}: {
  header?: string;
  children: ReactNode;
  footer?: () => ReactNode;
}) => {
  const activeModal = useActiveModal();

  return (
    <div className="bg-white w-full flex flex-col rounded-xl p-4 shadow-xl shadow-lg">
      {header && (
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-800">{header}</h4>
          <button
            onClick={() => activeModal.close()}
            className="w-9 h-9 rounded-full hover:bg-gray-100"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex-1 overflow-y-auto">{children}</div>
      {footer && <div className="flex justify-end gap-2 mt-4">{footer()}</div>}
    </div>
  );
};
```

##### Step 2: Implement AddUserModal.tsx

```tsx
import { useActiveModal } from "@sentuh/react-tailwind-modal";
import { Modal } from "./Modal";

export const AddUserModal = ({ onChange, model }: any) => {
  const activeModal = useActiveModal();

  const handleSave = () => {
    onChange({ id: 1, name: "John Doe Updated" });
    activeModal.close();
  };

  return (
    <Modal
      header="Add User"
      footer={() => (
        <>
          <button onClick={() => activeModal.close()}>Cancel</button>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white p-2 rounded"
          >
            Save
          </button>
        </>
      )}
    >
      <p>Example user: {model?.name}</p>
    </Modal>
  );
};
```

## API Reference

This section provides detailed information about the props and configuration options available for the Modal system.

#### 1. The `useModal` Hook

The `useModal` hook returns an object containing methods to control the modal stack programmatically.

| Prop           | Type                                                                                        | Description                                              |
| -------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `open`         | `(component: ModalComponentType, model?: any, options?: ModalOptionsProps) => Promise<any>` | Opens a modal. Resolves with data passed from the modal. |
| `close`        | `() => void  `                                                                              | Close current active modal                               |
| `dismissAll()` | `() => void `                                                                               | Close all active modals.                                 |

#### 2. Open Parameters

When calling m`odal.open()`, you can pass the following arguments to define what to render and how it behaves.

| Prop      | Type                                             | Description                                                                                                    |
| --------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| component | `JSX.Element` or `((props: any) => JSX.Element)` | The modal component to render. Can be a JSX element or a component function.                                   |
| model     | `any`                                            | Optional data passed to the modal component as props. Useful for pre-filling forms or passing contextual info. |
| options   | `ModalOptionsProps`                              | Optional modal configuration (size, backdrop, centered, scrollable, fullscreen, custom class).                 |

#### 3. Modal Options (options)

The `options` object is the third argument of the `open()` method. It allows you to customize the behavior and appearance of each specific modal instance.

| Prop                             | Type                  | Default              | Description                                                              |
| -------------------------------- | --------------------- | -------------------- | ------------------------------------------------------------------------ |
| backdrop                         | `boolean` or `static` | true                 | Whether a backdrop is shown. "static" disables closing on click outside. |
| keyboard                         | `boolean`             | false                | Allow ESC key to close modal.                                            |
| size                             | `ModalSize`           | Sets the modal size. |
| centered                         | `boolean`             | false                | Vertically center the modal.                                             |
| scrollable                       | `boolean`             | false                | Enable scrolling within modal body.                                      |
| wrapperClassName                 | `string`              | ""                   | Custom class for the outer modal wrapper.                                |
| backdropClassName                | `string`              | ""                   | Custom class for the backdrop element.wrapper.                           |
| wrappecontentClassNamerClassName | `string`              | ""                   | Custom class for the modal content container.wrapper.                    |

#### 4 Modal Size Reference

The size property supports flexible width presets: `3xs` | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl` | `4xl` | `5xl` | `6xl` | `7xl` | `screen`;

#### 5. The `useActiveModal` Hook

This hook is intended for use inside the component being rendered as a modal (the child component). It provides access to the current modal instance's controls.

| Prop       | Type         | Description                    |
| ---------- | ------------ | ------------------------------ |
| `close() ` | `() => void` | Close the current active modal |
