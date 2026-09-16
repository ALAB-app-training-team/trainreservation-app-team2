package com.alab.shinkansendego.facility;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "M_Facility")
@Entity
public class FacilityEntity {
    @Id
    @Column(name = "facility_cd")
    private String facilityCd;
    @Column(name = "name")
    private String name;
}
