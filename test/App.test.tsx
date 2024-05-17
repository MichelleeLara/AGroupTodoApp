import React from "react";
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from "vitest";
import { render, screen } from '@testing-library/react'
import App from "../src/App"

describe("<App/>", () => {
    test("should work", async() => {
        const user = userEvent.setup()
        render(<App/>)
         // buscar el input
    const input = screen.getByRole('textInput')
    expect(input).toBeDefined()

    // buscar el form
    const form = screen.getByRole('form')
    expect(form).toBeDefined()

    const button = form.querySelector('button')
    expect(button).toBeDefined()

    const randomText = crypto.randomUUID()
    await user.type(input, randomText)
    await user.click(button!)

    // asegurar que el elemento se ha agregado
    const list = screen.getByRole('list')
    expect(list).toBeDefined()
    expect(list.childNodes.length).toBe(1)


    })
})