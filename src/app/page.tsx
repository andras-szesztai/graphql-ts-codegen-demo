'use client'

import { Inter } from '@next/font/google'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import {
    CREATE_CAT_FACT,
    DELETE_CAT_FACT,
    READ_ALL_CAT_FACTS,
} from '@/lib/operations/catFacts'

import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

type CatFact = {
    id: string
    title: string
    description: string
}

export default function Home() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const { loading, error, data } = useQuery<{
        catFacts: CatFact[]
    }>(READ_ALL_CAT_FACTS)

    const [createCatFact] = useMutation(CREATE_CAT_FACT, {
        update(cache, { data: { createCatFact } }) {
            cache.modify({
                fields: {
                    catFacts(existingCatFacts: CatFact[] = []) {
                        return [
                            {
                                __typename: 'CatFact',
                                id: createCatFact.id,
                                title: createCatFact.title,
                                description: createCatFact.description,
                            },
                            ...existingCatFacts,
                        ]
                    },
                },
            })
        },
        onCompleted: () => {
            setTitle('')
            setDescription('')
        },
    })

    const [deleteCatFact] = useMutation(DELETE_CAT_FACT, {
        update(cache, { data: { deleteCatFact } }) {
            cache.modify({
                fields: {
                    catFacts(existingCatFacts: CatFact[] = []) {
                        return [
                            ...existingCatFacts.filter(
                                (catFact) => catFact.id !== deleteCatFact.id
                            ),
                        ]
                    },
                },
            })
        },
    })

    return (
        <main className={styles.main}>
            <div className={styles.center}>
                <h1 className={styles.description}>🐈‍⬛ CAT FACTS 🐈</h1>
                <input
                    className={styles.input}
                    placeholder="title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value)
                    }}
                />
                <textarea
                    className={styles.input}
                    placeholder="description"
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value)
                    }}
                />
                <button
                    className={styles.button}
                    onClick={() => {
                        createCatFact({
                            variables: {
                                title,
                                description,
                            },
                        })
                    }}
                >
                    Add Cat Fact
                </button>
                {loading && <p className={styles.description}>Loading...</p>}
                {error && (
                    <p className={styles.description}>
                        Ooops something went wrong
                    </p>
                )}
                {data?.catFacts.map((catFact) => (
                    <div
                        key={catFact.id}
                        className={styles.card}
                        onClick={() => {
                            deleteCatFact({
                                variables: {
                                    id: catFact.id,
                                },
                            })
                        }}
                    >
                        <h2 className={inter.className}>{catFact.title}</h2>
                        <p className={inter.className}>{catFact.description}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}
