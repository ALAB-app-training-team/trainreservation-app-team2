package com.alab.shinkansendego.traincarfacility;

import com.alab.shinkansendego.facility.FacilityEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "M_TrainCarFacility")
@Entity
public class TrainCarFacilityEntity {
    @Id
    @Column(name = "train_car_facility_cd")
    private String trainCarFacilityCd;
    @Column(name = "train_car_cd")
    private String trainCarCd;
    @Column(name = "facility_cd")
    private String facilityCd;
    @Column(name = "position")
    private String position;
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "facility_cd", referencedColumnName = "facility_cd", insertable = false, updatable = false)
    private FacilityEntity facility;
}
