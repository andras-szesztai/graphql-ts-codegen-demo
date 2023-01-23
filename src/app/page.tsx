'use client'

import { Inter } from '@next/font/google'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'

import {
    CREATE_CAT_FACT,
    DELETE_CAT_FACT,
    READ_ALL_CAT_FACTS,
} from '@/lib/operations/catFacts'
import { CatFact } from '@/lib/types/CatFact'
import { CatFactCard } from '@/lib/components/CatFactCard'

import styles from './page.module.css'

const inter = Inter({ subsets: ['latin'] })

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
                {loading && <p className={inter.className}>Loading...</p>}
                {error && (
                    <p className={inter.className}>
                        Ooops something went wrong
                    </p>
                )}
                {data?.catFacts.map((catFact) => (
                    <CatFactCard
                        key={catFact.id}
                        {...catFact}
                        onClick={() => {
                            deleteCatFact({
                                variables: {
                                    id: catFact.id,
                                },
                            })
                        }}
                    />
                ))}
            </div>
        </main>
    )
}
