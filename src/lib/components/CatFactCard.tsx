'use client'

import { Inter } from '@next/font/google'

import { CatFact } from '@/lib/types/CatFact'
import styles from '@/app/page.module.css'

type Props = Omit<CatFact, 'id'> & {
    onClick: () => void
}

const inter = Inter({ subsets: ['latin'] })

export function CatFactCard({ onClick, title, description }: Props) {
    return (
        <div className={styles.card} onClick={onClick}>
            <h2 className={inter.className}>{title}</h2>
            <p className={inter.className}>{description}</p>
        </div>
    )
}
