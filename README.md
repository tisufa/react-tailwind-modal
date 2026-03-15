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

Because this library uses Tailwind utility classes, you must tell Tailwind to scan the library's files for styles.

Add this line to your `main.ts`:

```tsx
// sentuh-tailwind-modal.css
import "@sentuh/react-tailwind-modal/dist/react-tailwind-modal.css";
```

## 🚀 Demo

You can try a **live demo** with example code here: https://stackblitz.com/edit/react-tailwind-modal

## 🛠 Usage Overview

#### 1. Wrap Your App with ModalProvider

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

There are two main ways to open a modal:

1. Passing the component class/function (recommended for reusability and automatic props handling)
2. Passing a JSX element directly (for quick one-off modals)

##### Method 1: Passing a Component (Recommended)

Best for reusability. The library handles instantiation and passes props automatically.

```tsx
import { useModal } from "@sentuh/react-tailwind-modal";
import { ExampleModal } from "./ExampleModal";

function App() {
  const modal = useModal();

  const handleOpen = () => {
    // Pass the component itself, modal will render it internally
    const result = await modal.open(ExampleModal);
    console.log(result);
  };

  return (
    <button
      className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick="handleOpen"
    >
      Open Modal
    </button>
  );
}
```

ExampleModal Example:

```tsx
import type { ModalProps } from "@sentuh/react-tailwind-modal";

export const ExampleModal = ({ onClose, onDismiss }: ModalProps) => {
  return (
    <>
      <div className="flex items-center justify-between pt-4 pb-2 pl-7 pr-4 border-none">
        <h6 className="m-0 font-bold text-gray-900 text-xl tracking-tight">
          Example Modal
        </h6>
      </div>
      <div className="pt-4 pb-6 px-7 text-gray-600 text-[0.95rem] leading-relaxed">
        <p>This is an example modal</p>
      </div>
      <div className="flex justify-end gap-3 py-5 px-7 bg-gray-50 border-none">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          onClick={onDismiss}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => onClose()}
        >
          Save
        </button>
      </div>
    </>
  );
};
```

**Note:** In this approach, `useModal.open()` will internally create and manage the modal instance.

You can pass dynamic data to your modal using the `model` argument:

```tsx
const model = { id: 1, name: "Jane Doe" };
const result = await modal.open(ExampleModal, model);
console.log(result); // { name: 'John Doe'}
```

Inside **ExampleModal**, access the passed data via the model prop:

```tsx
import type { ModalProps } from "@sentuh/react-tailwind-modal";
import { useEffect } from "react";
interface InputProps {
  id: string;
  name: string;
}

interface OutputProps {
  name: string;
}

interface Props extends ModalProps<InputProps, OutputProps> {}

export const ExampleModal = ({ onClose, onDismiss, model }: Props) => {
  useEffect(() => {
    console.log(model); // input: { id: 1, name: 'Jane Doe'}
  }, []);

  const handleSave = () => {
    // return output to parent
    onClose({ name: "John Doe" });
  };

  return (
    <>
      <div className="flex items-center justify-between pt-4 pb-2 pl-7 pr-4 border-none">
        <h6 className="m-0 font-bold text-gray-900 text-xl tracking-tight">
          Example Modal
        </h6>
      </div>
      <div className="pt-4 pb-6 px-7 text-gray-600 text-[0.95rem] leading-relaxed">
        <p>This is an example modal</p>
      </div>
      <div className="flex justify-end gap-3 py-5 px-7 bg-gray-50 border-none">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          onClick={onDismiss}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleSave()}
        >
          Save
        </button>
      </div>
    </>
  );
};
```

##### Method 2 — Passing JSX Element Directly

Best for quick, one-off modals with inline props.

```tsx
import { useModal } from "@sentuh/react-tailwind-modal";
import { ExampleModal } from "./ExampleModal";

function App() {
  const modal = useModal();

  const handleChange = (result: { name: string }) => {
    console.log(result); // output: { name: 'John Doe' }
  };

  const handleOpen = () => {
    modal.open(<ExampleModal onChange={handleChange} />);
  };

  return (
    <button
      className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onClick="handleOpen"
    >
      Open Modal
    </button>
  );
}
```

**Difference from Method 1:** In this approach, you pass a JSX element instead of the component reference. This is convenient for quick, one-off modals with inline props, but it is less reusable.

**⚠️ Important:** When using this approach, you need to implement `useActiveModal` inside your modal component to manually control closing or other modal actions. See Point 3 – Advanced Usage with useActiveModal for implementation examples.

### 3. Advanced Usage with useActiveModal

`useActiveModal` allows the modal itself to control its lifecycle, such as closing itself.

```tsx
import { useActiveModal, type ModalProps } from "@sentuh/react-tailwind-modal";

interface Props {
  onChange: (result: { name: string })
}

export const ExampleModal = ({ onChange }: Props) => {
  const activeModal = useActiveModal();
  const handleSave = () => {
    onChange({ name: 'John Doe' })
    activeModal.dismiss();
  };

  return (
    <>
      <div className="flex items-center justify-between pt-4 pb-2 pl-7 pr-4 border-none">
        <h6 className="m-0 font-bold text-gray-900 text-xl tracking-tight">
          Example Modal
        </h6>
      </div>
      <div className="pt-4 pb-6 px-7 text-gray-600 text-[0.95rem] leading-relaxed">
        <p>This is an example modal</p>
      </div>
      <div className="flex justify-end gap-3 py-5 px-7 bg-gray-50 border-none">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          onClick={activeModal.dismiss}
        >
          Cancel
        </button>

        <button
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => handleSave()}
        >
          Save
        </button>
      </div>
    </>
  );
};
```

> This approach is ideal for reusable modal components that need to self-manage close actions.

### 4. Create Reuse Component

To keep your UI consistent, create a base `Modal` wrapper and use it across your specific modal components.

##### Step 1: Create Modal.tsx

```tsx
import { useActiveModal } from "@sentuh/react-tailwind-modal";
import type { ReactNode } from "react";
interface Props {
  header?: string;
  children: ReactNode;
  footer?: () => ReactNode;
  isShowCloseButton?: boolean;
}
export const Modal = ({
  header,
  children,
  footer,
  isShowCloseButton = true,
}: Props) => {
  const activeModal = useActiveModal();
  return (
    <>
      {header && (
        <div className="flex items-center justify-between pt-4 pb-2 pl-7 pr-4 border-none">
          <h6 className="m-0 font-bold text-gray-900 text-xl tracking-tight">
            {header}
          </h6>

          {isShowCloseButton && (
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 bg-gray-100 text-gray-500 rounded-full border-none transition-all duration-200 ease-in-out hover:bg-gray-200 hover:text-gray-900 focus:outline-none"
              onClick={() => activeModal.dismiss()}
              aria-label="Close"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
      )}
      <div className="pt-4 pb-6 px-7 text-gray-600 text-[0.95rem] leading-relaxed">
        {children}
      </div>

      {footer && (
        <div className="flex justify-end gap-3 py-5 px-7 bg-gray-50 border-none">
          {footer()}
        </div>
      )}
    </>
  );
};
```

##### Step 2: Implement ExampleModal.tsx

```tsx
import { useActiveModal, type ModalProps } from "@sentuh/react-tailwind-modal";
import { Modal } from "./Modal";

export const ExampleModal = ({ onDismiss, onClose }: ModalProps) => {
  const handleSave = () => {
    onClose({ id: 1, name: "John Doe Updated" });
  };

  return (
    <Modal
      header="Example Modal"
      footer={() => (
        <>
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
            onClick={onDismiss}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => handleSave()}
          >
            Save
          </button>
        </>
      )}
    >
      <div className="space-y-3">
        <p className="text-gray-600">
          This is an example of a modal styled with{" "}
          <span className="font-semibold text-blue-600">Tailwind CSS</span>.
          Everything is now utility-based, making it easier to customize.
        </p>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            <strong>Pro Tip:</strong> You can easily change the button colors by
            adjusting the <code>bg-{`{color}`}</code> classes.
          </p>
        </div>
      </div>
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
| `close`        | `(result?: any) => void  `                                                                  | Close current active modal                               |
| `dismissAll()` | `() => void `                                                                               | Close all active modals.                                 |

#### 2. Open Parameters

When calling `modal.open()`, you can pass the following arguments to define what to render and how it behaves.

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

| Prop         | Type                     | Description                                                                                                        |
| ------------ | ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `close() `   | `(result?: any) => void` | Closes the modal and returns a success result to the caller. Use this for "Submit," "Save," or "OK" actions.       |
| `dismiss() ` | `() => void`             | Closes the modal without a result, typically triggering a cancel or rejection. Use this for "Cancel" buttons modal |
