package com.alab.shinkansendego.totalseat;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "V_TotalSeat")
public class TotalSeatEntity {
    @Id
    @Column(name = "train_series_cd")
    private String trainSeriesCd;
    @Column(name = "reserved_total")
    private Integer reservedTotal;
    @Column(name = "green_total")
    private Integer greenTotal;
    @Column(name = "gc_total")
    private Integer gcTotal;
}
